#!/usr/bin/env node

/**
 * WinDAGs MCP Server
 *
 * Exposes WinDAGs tools (next-move, skill-search, history) to any MCP client
 * (Claude Code, Cursor, etc.) via the Model Context Protocol.
 *
 * Active tools (zero API keys needed):
 *   - windags_skill_search: BM25 ranked skill catalog search (Porter stemming, real stopwords)
 *   - windags_history: View recent /next-move predictions and feedback
 *
 * Next-move predictions are handled by the slash skill (skills/next-move/SKILL.md)
 * inside the user's Claude Code session, not by this MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execFile as execFileCb } from "child_process";
import { readFile } from "fs/promises";
import * as fs from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

// @ts-ignore — wink packages are CJS without type declarations
import bm25 from "wink-bm25-text-search";
// @ts-ignore
import nlp from "wink-nlp-utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {
  ContextGatherer,
  NextMovePipeline,
  TripleStore,
  createLLMPredict,
  loadSkillsFromDirectory,
  buildNextMoveSystemPrompt,
  buildNextMoveUserPrompt,
  validatePredictedDAG,
  AnthropicProvider,
  OpenAICompatProvider,
  GoogleProvider,
  createOpenAICompatProvider,
  ProviderRouter,
  PROVIDER_ENV_VARS,
  PROVIDER_DISPLAY_NAMES,
} from "@workgroup-ai/core";
import type { SkillSummary, NextMoveTriple, ContextSnapshot, LLMProvider, ProviderId } from "@workgroup-ai/core";

const execFileAsync = promisify(execFileCb);

// ---------------------------------------------------------------------------
// Multi-Provider Auto-Detection
//
// Scans env vars for ANY configured LLM provider key.
// Anthropic, OpenAI, Google, Groq, xAI, DeepSeek, Together, Fireworks, Cerebras.
// First one found wins. User only needs ONE key.
// ---------------------------------------------------------------------------

function detectProvider(): { provider: LLMProvider; name: string } | null {
  // Check Anthropic first (it's the primary)
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    return { provider: new AnthropicProvider(anthropicKey), name: "Anthropic" };
  }

  // Check Google (has its own provider class)
  const googleKey = process.env.GOOGLE_API_KEY;
  if (googleKey) {
    return { provider: new GoogleProvider(googleKey), name: "Google" };
  }

  // Check all OpenAI-compatible providers
  const compatProviders: Array<{ id: ProviderId; envVar: string }> = [
    { id: "openai", envVar: "OPENAI_API_KEY" },
    { id: "groq", envVar: "GROQ_API_KEY" },
    { id: "grok", envVar: "XAI_API_KEY" },
    { id: "deepseek", envVar: "DEEPSEEK_API_KEY" },
    { id: "together", envVar: "TOGETHER_API_KEY" },
    { id: "fireworks", envVar: "FIREWORKS_API_KEY" },
    { id: "cerebras", envVar: "CEREBRAS_API_KEY" },
  ];

  for (const { id, envVar } of compatProviders) {
    const key = process.env[envVar];
    if (key) {
      const provider = createOpenAICompatProvider(id, key);
      const displayName = PROVIDER_DISPLAY_NAMES[id] || id;
      return { provider, name: displayName };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function safeExec(command: string, args: string[]): Promise<string> {
  try {
    const { stdout } = await execFileAsync(command, args, {
      timeout: 15_000,
      maxBuffer: 1024 * 1024,
    });
    return stdout;
  } catch {
    return "";
  }
}

async function readFileSafe(path: string): Promise<string> {
  try {
    return await readFile(path, "utf-8");
  } catch {
    return "";
  }
}

function findSkillsDir(): string {
  const candidates = [
    resolve(__dirname, "..", "..", "..", "skills"),
    resolve(process.cwd(), "skills"),
  ];
  return candidates[0];
}

function tripleStorePath(projectPath: string): string {
  return join(projectPath, ".windags", "triples");
}

// ---------------------------------------------------------------------------
// Skill Loading
// ---------------------------------------------------------------------------

let cachedSkills: ReturnType<typeof loadSkillsFromDirectory> = [];
let skillMap: Map<string, (typeof cachedSkills)[0]> = new Map();

function ensureSkillsLoaded(): typeof cachedSkills {
  if (cachedSkills.length > 0) return cachedSkills;
  const skillsDir = findSkillsDir();
  cachedSkills = loadSkillsFromDirectory(skillsDir, fs);
  skillMap = new Map(cachedSkills.map((s) => [s.id, s]));
  return cachedSkills;
}

function makeListSkills(): () => Promise<SkillSummary[]> {
  return async () => {
    const skills = ensureSkillsLoaded();
    return skills.map((s) => ({
      id: s.id,
      description: s.description,
      tags: s.tags,
      category: s.category ?? "Uncategorized",
    }));
  };
}

// ---------------------------------------------------------------------------
// BM25 Search — wink-bm25-text-search with wink-nlp-utils
//
// Proper information retrieval:
// - Porter stemming (deploy/deployment/deployed all match)
// - Real stopword list from wink-nlp-utils
// - BM25 scoring with document-length normalization
// - Zero API keys, zero cost, generalizes to any skill library
// ---------------------------------------------------------------------------

let searchEngine: any = null;

function ensureSearchReady(): void {
  if (searchEngine) return;
  ensureSkillsLoaded();

  searchEngine = bm25();

  // Configure wink's NLP pipeline for indexing:
  // lowercase → remove punctuation → remove stopwords → stem
  searchEngine.defineConfig({
    fldWeights: {
      name: 4,
      description: 2,
      tags: 3,
      category: 1,
      id_words: 2,
    },
    bm25Params: {
      k1: 1.5,
      b: 0.75,
      k: 1,
    },
  });

  searchEngine.definePrepTasks([
    nlp.string.lowerCase,
    nlp.string.removeExtraSpaces,
    nlp.string.tokenize0,
    nlp.tokens.removeWords,     // uses wink's built-in stopword list
    nlp.tokens.stem,            // Porter stemmer
    nlp.tokens.propagateNegations,
  ]);

  // Add each skill as a document
  for (const skill of cachedSkills) {
    searchEngine.addDoc({
      name: skill.name || "",
      description: (skill.description || "").slice(0, 500),
      tags: (skill.tags ?? []).join(" "),
      category: skill.category || "",
      id_words: skill.id.replace(/-/g, " "),
    }, skill.id);
  }

  // Consolidate the index (required before searching)
  searchEngine.consolidate();
}

interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  score: number;
}

function searchSkills(query: string, limit: number): SearchResult[] {
  ensureSearchReady();

  if (!query || query.trim().length === 0) {
    return cachedSkills.slice(0, limit).map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      category: s.category ?? "Uncategorized",
      tags: s.tags,
      score: 0,
    }));
  }

  const rawResults: Array<[string, number]> = searchEngine.search(query, limit);

  return rawResults.map(([id, score]) => {
    const skill = skillMap.get(id);
    return {
      id,
      name: skill?.name ?? id,
      description: skill?.description ?? "",
      category: skill?.category ?? "Uncategorized",
      tags: skill?.tags ?? [],
      score: Math.round(score * 1000) / 1000,
    };
  });
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer(
  { name: "windags", version: "0.1.0" },
);

// ---------------------------------------------------------------------------
// DISABLED: windags_next_move
//
// Next-move prediction is handled by the slash skill (skills/next-move/SKILL.md),
// which runs inside the user's Claude Code session with full conversation context,
// sub-agent spawning via the Agent tool, and AskUserQuestion for feedback.
//
// The infrastructure below (ContextGatherer, detectProvider, safeExec, provider
// routing) will be reused when windags_execute_dag is built — a tool that actually
// RUNS a DAG, not just predicts one.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _disabledNextMoveTool(
  { project_path, model }: { project_path: string; model?: string },
  { server: mcpServerInstance }: { server: any },
) {
    try {
      const projectDir = resolve(project_path);
      ensureSkillsLoaded();

      // Step 1: Gather context (deterministic, no LLM)
      const gatherer = new ContextGatherer({
        workingDirectory: projectDir,
        execFile: safeExec,
        readFile: readFileSafe,
        listSkills: makeListSkills(),
        sessionStartTime: new Date(),
      });

      const context = await gatherer.gather();
      const store = new TripleStore(tripleStorePath(projectDir));

      // Step 2: Get prediction via sampling (preferred) or direct API (fallback)
      const skillMdPath = resolve(findSkillsDir(), "next-move", "SKILL.md");
      let skillMd = "";
      try { skillMd = fs.readFileSync(skillMdPath, "utf-8"); } catch { /* no skill file */ }

      let prediction;

      // Try MCP sampling first — asks the client to run the LLM call
      try {
        const systemPrompt = buildNextMoveSystemPrompt(skillMd);
        const userPrompt = buildNextMoveUserPrompt(context);

        const samplingResult = await mcpServerInstance.createMessage({
          messages: [{ role: "user" as const, content: { type: "text" as const, text: userPrompt } }],
          systemPrompt: systemPrompt,
          modelPreferences: {
            hints: [{ name: model ?? "claude-haiku-4-5-20251001" }],
            costPriority: 0.9,       // prefer cheap
            speedPriority: 0.8,      // prefer fast
            intelligencePriority: 0.3,
          },
          maxTokens: 4096,
        });

        // Extract text from sampling response
        const responseText = samplingResult.content.type === "text"
          ? samplingResult.content.text
          : "";

        const cleaned = responseText.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
        const raw = JSON.parse(cleaned);
        const validation = validatePredictedDAG(raw);
        if (!validation.success) {
          throw new Error(`Validation failed: ${validation.errors.join("; ")}`);
        }
        prediction = validation.data;
      } catch (samplingErr) {
        // Sampling failed — fall back to direct API call with any available provider
        const detected = detectProvider();
        if (!detected) {
          const keyList = Object.entries(PROVIDER_ENV_VARS)
            .map(([id, env]) => `  ${env} (${PROVIDER_DISPLAY_NAMES[id] || id})`)
            .join("\n");
          throw new Error(
            `No LLM provider configured. Set at least one API key:\n${keyList}\n\n` +
            `Or use an MCP client that supports sampling (experimental).`
          );
        }

        // Use the detected provider via createLLMPredict
        const llmPredict = createLLMPredict({
          provider: detected.provider,
          model: model ?? undefined,
          skillMdPath,
        });
        const pipeline = new NextMovePipeline({
          gatherer, llmPredict, store,
          sessionId: `mcp-${Date.now()}`,
        });
        const result = await pipeline.run();
        if (!result.success) {
          return {
            content: [{ type: "text" as const, text: JSON.stringify({ success: false, errors: result.errors }, null, 2) }],
            isError: true,
          };
        }
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ success: true, tripleId: result.tripleId, prediction: result.prediction, provider: detected.name }, null, 2) }],
        };
      }

      // Store triple
      const { randomUUID } = await import("crypto");
      const tripleId = randomUUID();
      await store.save({
        id: tripleId,
        context,
        predicted_dag: prediction,
        feedback: null,
        timestamp: new Date().toISOString(),
        session_id: `mcp-sampling-${Date.now()}`,
      });

      return {
        content: [{ type: "text" as const, text: JSON.stringify({ success: true, tripleId, prediction }, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }, null, 2) }],
        isError: true,
      };
    }
}

// Tool 1: windags_skill_search
server.tool(
  "windags_skill_search",
  "Search the WinDAGs skill catalog using BM25 ranked retrieval with Porter stemming. " +
    "Returns skills ranked by relevance. Zero API keys needed.",
  {
    query: z.string().describe("Natural language search query"),
    limit: z.number().optional().default(10).describe("Max results (default: 10)"),
  },
  async ({ query, limit }) => {
    try {
      const results = searchSkills(query, limit ?? 10);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ query, total_matches: results.length, skills: results }, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }, null, 2) }],
        isError: true,
      };
    }
  }
);

// Tool 3: windags_history
server.tool(
  "windags_history",
  "View recent /next-move predictions and feedback for a project.",
  {
    project_path: z.string().describe("Absolute path to the project directory"),
    limit: z.number().optional().default(10).describe("Max entries (default: 10)"),
  },
  async ({ project_path, limit }) => {
    try {
      const projectDir = resolve(project_path);
      const store = new TripleStore(tripleStorePath(projectDir));
      const allTriples: NextMoveTriple[] = await store.list();

      allTriples.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const entries = allTriples.slice(0, limit ?? 10);

      const history = entries.map((t) => ({
        id: t.id,
        timestamp: t.timestamp,
        title: t.predicted_dag.title,
        confidence: t.predicted_dag.confidence,
        classification: t.predicted_dag.problem_classification,
        waves: t.predicted_dag.waves.length,
        nodes: t.predicted_dag.waves.reduce((s, w) => s + w.nodes.length, 0),
        verdict: t.predicted_dag.premortem.recommendation,
        accepted: t.feedback?.accepted ?? null,
        rating: t.feedback?.rating ?? null,
      }));

      return {
        content: [{ type: "text" as const, text: JSON.stringify({ project: projectDir, total: allTriples.length, history }, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }, null, 2) }],
        isError: true,
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("WinDAGs MCP server failed to start:", err);
  process.exit(1);
});

// run-pipeline.js — Headless /next-move runner.
//
// Server-side execution of the 5-stage meta-DAG (sensemaker → decomposer →
// skill-selector + premortem → synthesizer). Designed for non-Claude clients
// that cannot drive Claude Code's slash command but can call MCP tools.
//
// v0 scope (intentionally narrow):
//   - Provider-agnostic via llm-client.js. Auto-detects from env:
//     ANTHROPIC_API_KEY, OPENAI_API_KEY, GOOGLE_API_KEY (or GEMINI_API_KEY),
//     plus Groq / OpenRouter / Together / DeepSeek / Fireworks / Cerebras / xAI.
//     Pin a provider with WINDAGS_PROVIDER=<id>.
//   - No streaming; final result only.
//   - No triple write — that's the client's call after a human accepts.
//   - No MCP sampling fallback (yet) — tracked as v0.5.
//
// The function returns one of two shapes:
//   { halted: true, halt_reason, evidence_needed, sensemaker }
//   { predicted_dag, sensemaker, decomposer, skill_selection, premortem }

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

import { validatePredictedDAG } from "./validate-prediction.js";
import { callLLM, selectProvider, describeProvider } from "./llm-client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =============================================================================
// SIGNAL GATHERING
// =============================================================================

// Runs each command quietly and returns its stdout. Failure is information,
// not an exception — record it as a string. Mirrors the !`...` pre-expansion
// blocks the slash command relies on.
function safeExec(cmd, projectRoot) {
  try {
    return execSync(cmd, {
      cwd: projectRoot,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 5_000,
    }).trim();
  } catch (err) {
    return `(unavailable: ${err.code ?? "unknown"})`;
  }
}

function safeRead(filePath, maxLines = 60) {
  try {
    const text = fs.readFileSync(filePath, "utf-8");
    return text.split("\n").slice(0, maxLines).join("\n");
  } catch {
    return null;
  }
}

export function gatherSignals(projectRoot) {
  const claudeMd =
    safeRead(path.join(projectRoot, "CLAUDE.md")) ??
    safeRead(path.join(projectRoot, "AGENTS.md")) ??
    safeRead(path.join(projectRoot, "README.md"), 30) ??
    null;

  const packageJson =
    safeRead(path.join(projectRoot, "package.json"), 40) ??
    safeRead(path.join(projectRoot, "pyproject.toml"), 40) ??
    safeRead(path.join(projectRoot, "Cargo.toml"), 40) ??
    safeRead(path.join(projectRoot, "go.mod"), 40) ??
    null;

  const triplesDir = path.join(projectRoot, ".windags", "triples");
  let priorPredictions = [];
  try {
    if (fs.existsSync(triplesDir)) {
      priorPredictions = fs
        .readdirSync(triplesDir)
        .filter((f) => f.endsWith(".json"))
        .sort()
        .slice(-5);
    }
  } catch {
    // noop
  }

  return {
    project_root: projectRoot,
    git_status: safeExec("git status --short", projectRoot),
    git_branch: safeExec("git branch --show-current", projectRoot),
    recent_commits: safeExec("git log --oneline -8", projectRoot),
    diff_stat: safeExec("git diff --stat", projectRoot),
    staged_diff_stat: safeExec("git diff --cached --stat", projectRoot),
    recently_modified: safeExec("git diff --name-only HEAD~3", projectRoot),
    claude_md: claudeMd,
    project_manifest: packageJson,
    prior_predictions: priorPredictions,
  };
}

// =============================================================================
// PROMPT LOADING
// =============================================================================

// Resolve the bundled skills/next-move/prompts/<stage>.md file. The MCP
// server lives at <root>/mcp-server/, so the prompts are at ../skills/...
function loadStagePrompt(stage) {
  const promptPath = path.resolve(
    __dirname,
    "..",
    "skills",
    "next-move",
    "prompts",
    `${stage}.md`,
  );
  try {
    return fs.readFileSync(promptPath, "utf-8");
  } catch (err) {
    throw new Error(
      `Failed to load stage prompt '${stage}' at ${promptPath}: ${err.message}. ` +
        `Check that windags-skills installed correctly.`,
    );
  }
}

// =============================================================================
// JSON EXTRACTION + LIGHT VALIDATION
// =============================================================================

// LLMs often wrap JSON in ```json fences or prose preamble. Pull the first
// balanced { ... } block. Throws with the original text if no JSON survives.
function extractJson(text, stageName) {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenceMatch ? fenceMatch[1] : text).trim();

  // Find the outermost balanced object
  const start = candidate.indexOf("{");
  if (start < 0) {
    throw new Error(
      `${stageName} returned no JSON. First 300 chars: ${candidate.slice(0, 300)}`,
    );
  }
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const slice = candidate.slice(start, i + 1);
        try {
          return JSON.parse(slice);
        } catch (err) {
          throw new Error(
            `${stageName} returned malformed JSON: ${err.message}. ` +
              `First 300 chars of attempt: ${slice.slice(0, 300)}`,
          );
        }
      }
    }
  }
  throw new Error(
    `${stageName} JSON object never closed. Got ${candidate.length} chars.`,
  );
}

function requireFields(obj, fields, stageName) {
  const missing = fields.filter((f) => !(f in obj));
  if (missing.length > 0) {
    throw new Error(
      `${stageName} output missing required fields: ${missing.join(", ")}`,
    );
  }
}

// =============================================================================
// STAGES
// =============================================================================

async function runSensemaker(context, providerId) {
  const systemPrompt = loadStagePrompt("sensemaker");
  const userMessage =
    "Here is the ContextSnapshot. Return ONLY the SensemakerOutput JSON.\n\n" +
    JSON.stringify(context, null, 2);

  const { text, model, usage, elapsed_ms, provider } = await callLLM({
    providerId,
    systemPrompt,
    userMessage,
    tier: "balanced",
    maxTokens: 1024,
  });

  const raw = extractJson(text, "Sensemaker");
  // The prompt example uses `classification` + `key_signals`; the schema names
  // them `problem_classification` + `evidence`. Models follow the example, not
  // the schema. Normalize to schema names so downstream stages and the
  // returned shape match the documented contract.
  const output = {
    inferred_problem: raw.inferred_problem,
    problem_classification: raw.problem_classification ?? raw.classification,
    confidence: raw.confidence,
    halt_reason: raw.halt_reason ?? null,
    evidence: raw.evidence ?? raw.key_signals ?? [],
  };
  requireFields(
    output,
    ["inferred_problem", "problem_classification", "confidence", "halt_reason", "evidence"],
    "Sensemaker",
  );
  return { output, model, provider, usage, elapsed_ms };
}

function shouldHalt(sensemaker) {
  return (
    sensemaker.halt_reason !== null ||
    sensemaker.confidence < 0.6 ||
    sensemaker.problem_classification === "wicked"
  );
}

async function runDecomposer(sensemaker, context, providerId) {
  const systemPrompt = loadStagePrompt("decomposer");
  const userMessage =
    "SensemakerOutput:\n" +
    JSON.stringify(sensemaker, null, 2) +
    "\n\nContextSnapshot (subset for reference):\n" +
    JSON.stringify(
      {
        git_branch: context.git_branch,
        recently_modified: context.recently_modified,
      },
      null,
      2,
    ) +
    "\n\nReturn ONLY the DecomposerOutput JSON.";

  const { text, model, usage, elapsed_ms, provider } = await callLLM({
    providerId,
    systemPrompt,
    userMessage,
    tier: "balanced",
    maxTokens: 2048,
  });

  const output = extractJson(text, "Decomposer");
  requireFields(output, ["subtasks"], "Decomposer");
  if (!Array.isArray(output.subtasks) || output.subtasks.length === 0) {
    throw new Error("Decomposer output: subtasks must be a non-empty array");
  }
  return { output, model, provider, usage, elapsed_ms };
}

async function runSkillSelector(decomposer, narrowedCandidates, providerId) {
  const systemPrompt = loadStagePrompt("skill-selector");
  // Don't dictate a shape in the user message — let the system prompt's
  // example drive output. We accept both `selections` (schema name) and
  // `assignments` (prompt-example name) since they've drifted apart.
  const userMessage =
    "DecomposerOutput:\n" +
    JSON.stringify(decomposer, null, 2) +
    "\n\nNarrowed skill candidates per subtask (from local cascade):\n" +
    JSON.stringify(narrowedCandidates, null, 2) +
    "\n\nReturn ONLY the SkillSelectorOutput JSON per the prompt's Output Contract.";

  const { text, model, usage, elapsed_ms, provider } = await callLLM({
    providerId,
    systemPrompt,
    userMessage,
    tier: "fast",
    maxTokens: 2048,
  });

  const raw = extractJson(text, "SkillSelector");
  const list = raw.selections ?? raw.assignments ?? [];
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error(
      "SkillSelector: expected non-empty 'selections' or 'assignments' array. " +
        `Got keys: ${Object.keys(raw).join(", ")}`,
    );
  }
  // Normalize each entry to the schema's field names.
  const selections = list.map((a) => ({
    subtask_id: a.subtask_id,
    primary_skill: a.primary_skill ?? a.skill_id ?? a.primary_skill_id,
    runner_up: a.runner_up ?? a.runner_up_skill_id ?? null,
    reasoning: a.reasoning ?? a.why ?? a.justification ?? "",
    model_tier: a.model_tier ?? "balanced",
    estimated_minutes: a.estimated_minutes ?? null,
    estimated_cost_usd: a.estimated_cost_usd ?? null,
  }));
  return { output: { selections }, model, provider, usage, elapsed_ms };
}

async function runPreMortem(decomposer, providerId) {
  const systemPrompt = loadStagePrompt("premortem");
  const userMessage =
    "DecomposerOutput:\n" +
    JSON.stringify(decomposer, null, 2) +
    "\n\nReturn ONLY the PreMortemOutput JSON per the prompt's Output Contract.";

  const { text, model, usage, elapsed_ms, provider } = await callLLM({
    providerId,
    systemPrompt,
    userMessage,
    tier: "fast",
    maxTokens: 2048,
  });

  const raw = extractJson(text, "PreMortem");
  if (!Array.isArray(raw.risks)) {
    throw new Error(
      `PreMortem: expected 'risks' array. Got keys: ${Object.keys(raw).join(", ")}`,
    );
  }
  return {
    output: {
      recommendation: raw.recommendation ?? "PROCEED",
      risks: raw.risks,
    },
    model,
    provider,
    usage,
    elapsed_ms,
  };
}

const SYNTHESIZER_SYSTEM_PROMPT = `You are the Synthesizer — the final stage of the /next-move meta-DAG. The Sensemaker, Decomposer, Skill Selector, and PreMortem agents have run. Your job is to produce a single JSON object: a PredictedDAG that satisfies predicted-dag.schema.json exactly.

You return JSON. No markdown. No prose. No fences. Just the object.

## Required top-level fields

- "title": string — short imperative summary of what the DAG accomplishes
- "problem_classification": one of "well-structured" | "ill-structured" | "wicked" (copy from Sensemaker)
- "confidence": number 0–1 (copy from Sensemaker)
- "waves": array of PredictedWave
- "estimated_total_minutes": number (sum of all node estimates)
- "estimated_total_cost_usd": number (sum of all node estimates)
- "premortem": object { "recommendation": "ACCEPT" | "ACCEPT_WITH_MONITORING" | "REVISE" | "REJECT", "risks": [...] }

## PredictedWave shape (required fields)

- "wave_number": integer ≥ 0
- "parallelizable": boolean (true if nodes in this wave have no internal dependencies)
- "nodes": array of PredictedNode

## PredictedNode shape (every field is REQUIRED)

- "id": kebab-case string, unique within the DAG
- "skill_id": string — must be one of the primary_skill values from the SkillSelector input (do NOT invent skill IDs and do NOT use null)
- "role_description": one short paragraph describing what this node does in this DAG specifically
- "why": one sentence explaining why this skill was chosen for this subtask
- "input_contract": short string describing what the node consumes (upstream node IDs, files, signals)
- "output_contract": short string describing what the node produces
- "commitment_level": "COMMITTED" (high confidence) | "TENTATIVE" (likely but may change) | "EXPLORATORY" (might be discarded)
- "model_tier": "fast" (cheap, simple tasks) | "balanced" (default) | "powerful" (heavy reasoning) — pick per node based on cognitive load
- "estimated_minutes": number ≥ 0 (wall-clock)
- "estimated_cost_usd": number ≥ 0 (rough — pennies for haiku nodes, $0.05–$0.30 for sonnet, $0.30–$1.50 for opus)
- "cascade_depth": integer ≥ 0 (this node's wave_number)

## Rules

1. Map each Decomposer subtask to exactly one node. Wave assignments come from the subtask dependencies.
2. Always set "skill_id" to a valid skill from the SkillSelector. If the SkillSelector did not pick one, copy the runner_up. Never null. Never invented.
3. Convert any "fast"/"balanced"/"powerful" tier hints to "haiku"/"sonnet"/"opus" respectively.
4. Fold the PreMortem output into the top-level "premortem" field unchanged.
5. Sum estimates honestly — do not pad.

Return ONLY the JSON object.`;

// Map any tier hint (Anthropic-named or provider-agnostic) to the
// validator's enum: fast | balanced | powerful. The JSON schema in
// skills/next-move/schemas uses haiku/sonnet/opus, but the runtime Zod
// validator in validate-prediction.js uses fast/balanced/powerful and is
// what windags_validate_dag actually checks. We follow the validator.
function normalizeTierForSchema(t) {
  const k = (t ?? "").toString().toLowerCase();
  if (k === "fast" || k === "haiku" || k === "nano" || k === "mini" || k === "flash") return "fast";
  if (k === "powerful" || k === "opus" || k === "ultra") return "powerful";
  return "balanced"; // sonnet / pro / unknown → balanced
}

function postProcessPredictedDAG(raw, { skillSelector, premortem }) {
  // Build a lookup of subtask_id → skill_id from selector, used as a
  // rescue when the model leaves skill_id null.
  const selectorMap = {};
  for (const s of (skillSelector?.selections ?? [])) {
    selectorMap[s.subtask_id] = s.primary_skill ?? s.runner_up;
  }

  if (Array.isArray(raw.waves)) {
    raw.waves = raw.waves.map((w, wi) => {
      const wave = { ...w };
      wave.wave_number = wave.wave_number ?? wi;
      wave.parallelizable = wave.parallelizable ?? (wave.nodes?.length ?? 0) > 1;
      wave.nodes = (wave.nodes ?? []).map((n) => ({
        id: n.id,
        skill_id: n.skill_id || selectorMap[n.id] || "general-purpose",
        role_description: n.role_description ?? n.description ?? n.why ?? "",
        why: n.why ?? n.role_description ?? "",
        input_contract: n.input_contract ?? "",
        output_contract: n.output_contract ?? "",
        commitment_level: n.commitment_level ?? "TENTATIVE",
        model_tier: normalizeTierForSchema(n.model_tier),
        estimated_minutes: n.estimated_minutes ?? 5,
        estimated_cost_usd: n.estimated_cost_usd ?? 0.02,
        cascade_depth: n.cascade_depth ?? wave.wave_number ?? wi,
      }));
      return wave;
    });
  }

  // Premortem rescue: normalize recommendation to validator's enum and
  // copy risks. The premortem stage prompt uses a different enum
  // (PROCEED / ACCEPT_WITH_MONITORING / ESCALATE_TO_HUMAN) than
  // validate-prediction.js (ACCEPT / ACCEPT_WITH_MONITORING / REVISE /
  // REJECT) — map across the obvious correspondences.
  const remapRecommendation = (r) => {
    const k = (r ?? "").toString().toUpperCase();
    if (k === "PROCEED" || k === "ACCEPT") return "ACCEPT";
    if (k === "ACCEPT_WITH_MONITORING") return "ACCEPT_WITH_MONITORING";
    if (k === "REVISE" || k === "MODIFY") return "REVISE";
    if (k === "ESCALATE_TO_HUMAN" || k === "REJECT") return "REJECT";
    return "ACCEPT_WITH_MONITORING";
  };

  const inputRec = (raw.premortem && raw.premortem.recommendation) ?? premortem?.recommendation;
  const inputRisks = (raw.premortem && raw.premortem.risks) ?? premortem?.risks ?? [];
  raw.premortem = {
    recommendation: remapRecommendation(inputRec),
    risks: inputRisks,
  };

  // Total estimates rescue.
  if (typeof raw.estimated_total_minutes !== "number") {
    raw.estimated_total_minutes = (raw.waves ?? []).reduce(
      (sum, w) => sum + (w.nodes ?? []).reduce((s, n) => s + (n.estimated_minutes ?? 0), 0),
      0,
    );
  }
  if (typeof raw.estimated_total_cost_usd !== "number") {
    raw.estimated_total_cost_usd = (raw.waves ?? []).reduce(
      (sum, w) => sum + (w.nodes ?? []).reduce((s, n) => s + (n.estimated_cost_usd ?? 0), 0),
      0,
    );
  }
  return raw;
}

async function runSynthesizer({ sensemaker, decomposer, skillSelector, premortem, providerId }) {
  const userMessage =
    "Sensemaker:\n" + JSON.stringify(sensemaker, null, 2) +
    "\n\nDecomposer:\n" + JSON.stringify(decomposer, null, 2) +
    "\n\nSkillSelector:\n" + JSON.stringify(skillSelector, null, 2) +
    "\n\nPreMortem:\n" + JSON.stringify(premortem, null, 2) +
    "\n\nReturn the PredictedDAG JSON.";

  const { text, model, usage, elapsed_ms, provider } = await callLLM({
    providerId,
    systemPrompt: SYNTHESIZER_SYSTEM_PROMPT,
    userMessage,
    tier: "balanced",
    maxTokens: 4096,
  });

  let output = extractJson(text, "Synthesizer");
  output = postProcessPredictedDAG(output, { skillSelector, premortem });

  // Defer to the existing PredictedDAG validator so we share the contract
  // with windags_validate_dag instead of drifting.
  const validation = validatePredictedDAG(output);
  if (!validation.success) {
    const errs = (validation.errors ?? []).slice(0, 6).map((e) => `  - ${e}`).join("\n");
    throw new Error(
      `Synthesizer produced an invalid PredictedDAG. First errors:\n${errs}`,
    );
  }

  return { output: validation.data, model, provider, usage, elapsed_ms };
}

// =============================================================================
// ORCHESTRATOR
// =============================================================================

export async function runPipeline({
  task,
  projectRoot,
  fresh = false,
  cascadeSearch, // injected from index.js — runs the local skill-search cascade
}) {
  if (!projectRoot) {
    throw new Error(
      "windags_run_pipeline: project_root is required. The MCP server can't " +
        "infer the user's project from libexec.",
    );
  }
  if (typeof cascadeSearch !== "function") {
    throw new Error("Internal: cascadeSearch must be injected by the caller");
  }

  const stages = {};
  const usageLog = [];
  const startMs = Date.now();

  // Pick provider up-front so every stage uses the same one and the failure
  // mode (no key set) surfaces before any LLM call. selectProvider() throws
  // a helpful error when nothing is configured.
  const providerId = selectProvider();
  const providerLabel = describeProvider(providerId);

  const recordUsage = (stage, r) => {
    usageLog.push({
      stage,
      provider: r.provider,
      model: r.model,
      ...r.usage,
      elapsed_ms: r.elapsed_ms,
    });
  };

  // Stage 1: gather signals
  const signals = gatherSignals(projectRoot);
  const context = {
    ...signals,
    user_focus_hint: task ?? null,
    fresh_mode: !!fresh,
  };
  stages.signals = signals;

  // Stage 2: sensemaker (+ halt gate)
  const sensemaker = await runSensemaker(context, providerId);
  stages.sensemaker = sensemaker.output;
  recordUsage("sensemaker", sensemaker);

  if (shouldHalt(sensemaker.output)) {
    return {
      halted: true,
      halt_reason: sensemaker.output.halt_reason ?? "Confidence below halt threshold or wicked classification",
      evidence_needed: sensemaker.output.evidence,
      sensemaker: sensemaker.output,
      provider: providerId,
      provider_label: providerLabel,
      usage_log: usageLog,
      elapsed_ms: Date.now() - startMs,
    };
  }

  // Stage 3: decomposer
  const decomposer = await runDecomposer(sensemaker.output, context, providerId);
  stages.decomposer = decomposer.output;
  recordUsage("decomposer", decomposer);

  // Stage 4: skill narrowing — call the local cascade directly (zero round-trips)
  const queries = decomposer.output.subtasks.map((s) => ({
    task_id: s.id,
    query: s.description,
    limit: 8,
  }));
  const narrowed = [];
  for (const q of queries) {
    const { results } = await cascadeSearch(q.query, q.limit);
    narrowed.push({
      task_id: q.task_id,
      candidates: results.map((r) => ({ skill_id: r.id, score: r.score, description: r.description })),
    });
  }

  // Stage 5: skill selector + premortem in parallel
  const [skillSelector, premortem] = await Promise.all([
    runSkillSelector(decomposer.output, narrowed, providerId),
    runPreMortem(decomposer.output, providerId),
  ]);
  stages.skill_selector = skillSelector.output;
  stages.premortem = premortem.output;
  recordUsage("skill_selector", skillSelector);
  recordUsage("premortem", premortem);

  // Stage 6: synthesizer → PredictedDAG
  const synthesizer = await runSynthesizer({
    sensemaker: sensemaker.output,
    decomposer: decomposer.output,
    skillSelector: skillSelector.output,
    premortem: premortem.output,
    providerId,
  });
  recordUsage("synthesizer", synthesizer);

  return {
    halted: false,
    predicted_dag: synthesizer.output,
    sensemaker: sensemaker.output,
    decomposer: decomposer.output,
    skill_selection: skillSelector.output,
    premortem: premortem.output,
    narrowed_candidates: narrowed,
    provider: providerId,
    provider_label: providerLabel,
    usage_log: usageLog,
    elapsed_ms: Date.now() - startMs,
  };
}

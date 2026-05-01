/**
 * DAG cost estimator (standalone, simplified mirror of @workgroup-ai/core).
 *
 * Mirrors the relevant pieces of packages/core/src/pricing/token-estimator.ts.
 * The standalone version is intentionally simpler than core:
 *   - char-based token estimate (~4 chars/token), no provider tokenizer
 *   - no skill body resolution from disk (caller can pass body sizes if known)
 *   - per-tier pricing only ('haiku' | 'sonnet' | 'opus')
 *
 * Numbers will not match core's TokenEstimator exactly. Treat them as a
 * planning-time order-of-magnitude estimate, not a billing prediction.
 */

import * as fs from "fs";
import * as path from "path";

const CHARS_PER_TOKEN = 4;

/**
 * Per-tier pricing in USD per million tokens. Calibrated to Anthropic Claude
 * since that's the primary route. Other providers will produce reasonable
 * but imperfect estimates because their actual prices differ.
 */
const TIER_PRICING = {
  haiku: { inputPerMillion: 0.8, outputPerMillion: 4.0 },
  sonnet: { inputPerMillion: 3.0, outputPerMillion: 15.0 },
  opus: { inputPerMillion: 15.0, outputPerMillion: 75.0 },
};

/**
 * Heuristic for output token count given the node's expected work.
 * Without a tokenizer we can't be precise — assume the agent produces
 * roughly 1500 chars of output per skill body it consumes, capped.
 */
function estimateOutputTokens(skillBodyChars, descriptionChars, hasUpstream) {
  const baseOutput = 100; // minimum response
  const skillOutput = Math.min(skillBodyChars / 80, 1500); // produce ~1.25% of skill body length
  const descOutput = descriptionChars / 20; // some output proportional to ask
  const upstreamBonus = hasUpstream ? 100 : 0;
  return Math.round((baseOutput + skillOutput + descOutput + upstreamBonus) / CHARS_PER_TOKEN);
}

/**
 * Estimate one node's cost given its prompt parts (chars, not tokens).
 */
function estimateNode({ skillBodyChars, descriptionChars, upstreamChars, referenceFileCount, model }) {
  const tier = TIER_PRICING[model] ?? TIER_PRICING.sonnet;
  const referenceChars = referenceFileCount * 800; // assume ~800 chars/reference loaded
  const inputChars = skillBodyChars + descriptionChars + upstreamChars + referenceChars;
  const inputTokens = Math.ceil(inputChars / CHARS_PER_TOKEN);
  const outputTokens = estimateOutputTokens(skillBodyChars, descriptionChars, upstreamChars > 0);
  const inputCost = (inputTokens / 1_000_000) * tier.inputPerMillion;
  const outputCost = (outputTokens / 1_000_000) * tier.outputPerMillion;
  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    costUsd: inputCost + outputCost,
  };
}

/**
 * Best-effort skill body resolution: read SKILL.md from a known skills dir,
 * return its char length, or 0 if not found.
 */
function resolveSkillBodyChars(skillId, skillsDir) {
  if (skillId.startsWith("user:")) return 0; // user skills can't be resolved by id alone here
  const md = path.join(skillsDir, skillId, "SKILL.md");
  try {
    const content = fs.readFileSync(md, "utf-8");
    // Body only (after frontmatter)
    const m = content.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
    return (m ? m[1] : content).length;
  } catch {
    return 0;
  }
}

/**
 * Estimate total cost for a planned DAG.
 *
 * @param params.nodes - Array of {id, skillIds, description, dependencies, model?, referenceFileCount?}
 * @param params.defaultModel - Tier to use when a node doesn't specify one
 * @param params.skillsDir - Where to read SKILL.md files from
 * @returns { totalCostUsd, totalTokens, perNode: [{node_id, input_tokens, output_tokens, total_tokens, cost_usd}] }
 */
export function estimateDAGCostFromSpec({ nodes, defaultModel = "sonnet", skillsDir }) {
  const perNodeCosts = new Map();
  const nodeOutputChars = new Map(); // for upstream sizing
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const processed = new Set();
  const queue = [...nodes];
  const maxIterations = nodes.length * nodes.length + 1;
  let iteration = 0;
  let totalCostUsd = 0;
  let totalTokens = 0;

  while (queue.length > 0 && iteration < maxIterations) {
    iteration++;
    const node = queue.shift();
    const allDepsProcessed = (node.dependencies || []).every((d) => processed.has(d));
    if (!allDepsProcessed) {
      queue.push(node);
      continue;
    }

    let skillBodyChars = 0;
    for (const skillId of node.skillIds || []) {
      skillBodyChars += resolveSkillBodyChars(skillId, skillsDir);
    }

    let upstreamChars = 0;
    for (const depId of node.dependencies || []) {
      upstreamChars += nodeOutputChars.get(depId) ?? 0;
    }

    const model = node.model || defaultModel;
    const est = estimateNode({
      skillBodyChars,
      descriptionChars: (node.description || "").length,
      upstreamChars,
      referenceFileCount: node.referenceFileCount || 0,
      model,
    });

    perNodeCosts.set(node.id, est);
    nodeOutputChars.set(node.id, est.outputTokens * CHARS_PER_TOKEN);
    totalCostUsd += est.costUsd;
    totalTokens += est.totalTokens;
    processed.add(node.id);
  }

  return {
    totalCostUsd,
    totalTokens,
    perNode: Array.from(perNodeCosts.entries()).map(([id, est]) => ({
      node_id: id,
      input_tokens: est.inputTokens,
      output_tokens: est.outputTokens,
      total_tokens: est.totalTokens,
      cost_usd: Math.round(est.costUsd * 10000) / 10000,
    })),
  };
}

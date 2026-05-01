/**
 * Provider model catalog (standalone, mirrors @workgroup-ai/core PROVIDER_MODELS).
 *
 * The standalone MCP can't depend on @workgroup-ai/core (that pulls in
 * Transformers.js, onnxruntime, the whole DAG runtime). So the data we need
 * to map abstract tiers ("fast" / "balanced" / "powerful") to provider-native
 * model IDs lives here, copied from
 *   packages/core/src/providers/openai-compat-provider.ts
 *
 * If new models land in core, mirror the change here. Last sync: 2026-04-30
 * against monorepo PROVIDER_MODELS.
 *
 * Why this exists: the 2026-03-31 bug was non-Anthropic providers receiving
 * "haiku" / "sonnet" / "opus" as model_tier strings, which their APIs reject
 * with 400. Every entry below is a real, provider-accepted model ID.
 */

/** Display names for providers, keyed by provider id. */
export const PROVIDER_DISPLAY_NAMES = {
  anthropic: "Anthropic",
  google: "Google",
  openrouter: "OpenRouter",
  openai: "OpenAI",
  grok: "Grok (xAI)",
  groq: "Groq",
  together: "Together AI",
  deepseek: "DeepSeek",
  fireworks: "Fireworks AI",
  cerebras: "Cerebras",
  ollama: "Ollama (local)",
  "workers-ai": "Workers AI",
};

/** Per-provider env var that signals "this provider is configured." */
export const PROVIDER_ENV_VARS = {
  anthropic: "ANTHROPIC_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
  openai: "OPENAI_API_KEY",
  google: "GOOGLE_API_KEY",
  grok: "XAI_API_KEY",
  groq: "GROQ_API_KEY",
  together: "TOGETHER_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
  fireworks: "FIREWORKS_API_KEY",
  cerebras: "CEREBRAS_API_KEY",
  "workers-ai": "CLOUDFLARE_API_TOKEN",
};

/**
 * Static catalogs for OpenAI-compatible providers. Each entry has a `tier`
 * field grouping the model into fast | balanced | powerful.
 */
export const PROVIDER_MODELS = {
  openrouter: [
    { id: "anthropic/claude-sonnet-4", displayName: "Claude Sonnet 4", tier: "balanced" },
    { id: "anthropic/claude-haiku-4", displayName: "Claude Haiku 4", tier: "fast" },
    { id: "openai/gpt-4o", displayName: "GPT-4o", tier: "powerful" },
    { id: "openai/gpt-4o-mini", displayName: "GPT-4o Mini", tier: "fast" },
    { id: "google/gemini-2.5-pro", displayName: "Gemini 2.5 Pro", tier: "powerful" },
    { id: "google/gemini-2.5-flash", displayName: "Gemini 2.5 Flash", tier: "fast" },
    { id: "meta-llama/llama-3.3-70b-instruct", displayName: "Llama 3.3 70B", tier: "balanced" },
    { id: "deepseek/deepseek-r1", displayName: "DeepSeek R1", tier: "powerful" },
    { id: "mistralai/mistral-large-2", displayName: "Mistral Large 2", tier: "balanced" },
    { id: "qwen/qwen-2.5-72b-instruct", displayName: "Qwen 2.5 72B", tier: "balanced" },
  ],
  openai: [
    { id: "gpt-5.5", displayName: "GPT-5.5", tier: "powerful" },
    { id: "gpt-5.4", displayName: "GPT-5.4", tier: "balanced" },
    { id: "gpt-5.4-nano", displayName: "GPT-5.4 Nano", tier: "fast" },
  ],
  grok: [
    { id: "grok-3", displayName: "Grok 3", tier: "powerful" },
    { id: "grok-3-mini", displayName: "Grok 3 Mini", tier: "fast" },
  ],
  groq: [
    { id: "llama-3.3-70b-versatile", displayName: "Llama 3.3 70B", tier: "balanced" },
    { id: "llama-3.1-8b-instant", displayName: "Llama 3.1 8B", tier: "fast" },
  ],
  together: [
    { id: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo", displayName: "Llama 3.1 405B", tier: "powerful" },
    { id: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", displayName: "Llama 3.1 70B", tier: "balanced" },
  ],
  deepseek: [
    { id: "deepseek-chat", displayName: "DeepSeek V3", tier: "balanced" },
    { id: "deepseek-reasoner", displayName: "DeepSeek R1", tier: "powerful" },
  ],
  fireworks: [
    { id: "accounts/fireworks/models/llama-v3p1-405b-instruct", displayName: "Llama 3.1 405B", tier: "powerful" },
    { id: "accounts/fireworks/models/llama-v3p1-70b-instruct", displayName: "Llama 3.1 70B", tier: "balanced" },
  ],
  cerebras: [
    { id: "llama3.1-70b", displayName: "Llama 3.1 70B", tier: "balanced" },
    { id: "llama3.1-8b", displayName: "Llama 3.1 8B", tier: "fast" },
  ],
  ollama: [
    { id: "llama3.1:latest", displayName: "Llama 3.1 (local)", tier: "balanced" },
    { id: "mistral:latest", displayName: "Mistral (local)", tier: "fast" },
  ],
  "workers-ai": [
    { id: "@cf/openai/gpt-oss-20b", displayName: "GPT OSS 20B (Workers AI)", tier: "fast" },
    { id: "@cf/meta/llama-4-scout-17b-16e-instruct", displayName: "Llama 4 Scout 17B (Workers AI)", tier: "balanced" },
    { id: "@cf/openai/gpt-oss-120b", displayName: "GPT OSS 120B (Workers AI)", tier: "powerful" },
  ],
};

/**
 * Build the inverted map: tier → array of {provider, modelId, displayName}.
 * Anthropic and Google aren't in PROVIDER_MODELS (their core provider
 * classes don't expose a static catalog), so we hand-add them.
 */
export function buildModelTierMap() {
  const tiers = { fast: [], balanced: [], powerful: [] };

  // Anthropic — not in PROVIDER_MODELS
  tiers.fast.push({ provider: "anthropic", modelId: "claude-haiku-4-5-20251001", displayName: "Claude Haiku 4.5" });
  tiers.balanced.push({ provider: "anthropic", modelId: "claude-sonnet-4-6", displayName: "Claude Sonnet 4.6" });
  tiers.powerful.push({ provider: "anthropic", modelId: "claude-opus-4-7", displayName: "Claude Opus 4.7" });

  // Google — not in PROVIDER_MODELS
  tiers.fast.push({ provider: "google", modelId: "gemini-2.5-flash", displayName: "Gemini 2.5 Flash" });
  tiers.balanced.push({ provider: "google", modelId: "gemini-2.5-pro", displayName: "Gemini 2.5 Pro" });
  tiers.powerful.push({ provider: "google", modelId: "gemini-2.5-pro", displayName: "Gemini 2.5 Pro" });

  // OpenAI-compatible providers — pull from the static catalog
  for (const [providerId, models] of Object.entries(PROVIDER_MODELS)) {
    for (const m of models) {
      const tier = m.tier;
      if (!tier || !tiers[tier]) continue;
      tiers[tier].push({ provider: providerId, modelId: m.id, displayName: m.displayName });
    }
  }

  return tiers;
}

/**
 * Heuristic: which model tier a given skill category benefits from.
 * Coarse — the planner can override per-node.
 */
export function suggestTierForCategory(category) {
  const c = (category || "").toLowerCase();
  if (
    c.includes("research") ||
    c.includes("analysis") ||
    c.includes("architecture") ||
    c.includes("reasoning") ||
    c.includes("planning")
  ) {
    return "powerful";
  }
  if (
    c.includes("formatting") ||
    c.includes("logging") ||
    c.includes("script") ||
    c.includes("classification")
  ) {
    return "fast";
  }
  return "balanced";
}

/**
 * Detect which LLM provider is configured via environment. Returns the
 * provider id (e.g. "anthropic", "groq") or null if none. Order matters —
 * Anthropic first since it's primary.
 */
export function detectProviderFromEnv() {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.GOOGLE_API_KEY) return "google";
  for (const [id, envVar] of Object.entries(PROVIDER_ENV_VARS)) {
    if (id === "anthropic" || id === "google") continue;
    if (process.env[envVar]) return id;
  }
  return null;
}

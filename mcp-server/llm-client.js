/**
 * Provider-agnostic LLM client for windags_run_pipeline.
 *
 * Dispatches a single { systemPrompt, userMessage, tier } request to whichever
 * provider is configured. Auto-detects from env unless WINDAGS_PROVIDER is set.
 *
 * Supported (auto-detected in this priority order):
 *   - anthropic  (ANTHROPIC_API_KEY)        — native /v1/messages
 *   - openai     (OPENAI_API_KEY)           — native /v1/chat/completions
 *   - google     (GOOGLE_API_KEY | GEMINI_API_KEY) — native generateContent
 *   - groq       (GROQ_API_KEY)             — OpenAI-compat
 *   - openrouter (OPENROUTER_API_KEY)       — OpenAI-compat
 *   - together   (TOGETHER_API_KEY)         — OpenAI-compat
 *   - deepseek   (DEEPSEEK_API_KEY)         — OpenAI-compat
 *   - fireworks  (FIREWORKS_API_KEY)        — OpenAI-compat
 *   - cerebras   (CEREBRAS_API_KEY)         — OpenAI-compat
 *   - grok       (XAI_API_KEY)              — OpenAI-compat
 *
 * Override with WINDAGS_PROVIDER=<id>. The selected provider's env var must
 * still be set or the call throws with a clear message.
 *
 * Tier resolution: (provider, tier) → provider-native model ID via the
 * shared catalog in provider-models.js. Same source of truth that
 * windags_node_requirements uses, so the tool description and the runtime
 * agree.
 */

import {
  PROVIDER_ENV_VARS,
  PROVIDER_DISPLAY_NAMES,
  buildModelTierMap,
  detectProviderFromEnv,
} from "./provider-models.js";

// =============================================================================
// PROVIDER → HTTP SHAPE
// =============================================================================

const PROVIDER_HTTP = {
  anthropic: { kind: "anthropic", baseUrl: "https://api.anthropic.com/v1" },
  openai: { kind: "openai", baseUrl: "https://api.openai.com/v1" },
  google: { kind: "google", baseUrl: "https://generativelanguage.googleapis.com/v1beta" },
  groq: { kind: "openai-compat", baseUrl: "https://api.groq.com/openai/v1" },
  openrouter: { kind: "openai-compat", baseUrl: "https://openrouter.ai/api/v1" },
  together: { kind: "openai-compat", baseUrl: "https://api.together.xyz/v1" },
  deepseek: { kind: "openai-compat", baseUrl: "https://api.deepseek.com/v1" },
  fireworks: { kind: "openai-compat", baseUrl: "https://api.fireworks.ai/inference/v1" },
  cerebras: { kind: "openai-compat", baseUrl: "https://api.cerebras.ai/v1" },
  grok: { kind: "openai-compat", baseUrl: "https://api.x.ai/v1" },
};

// Inverted (provider, tier) → modelId map. Computed once.
let _modelByProviderTier = null;
function modelFor(providerId, tier) {
  if (!_modelByProviderTier) {
    const tierMap = buildModelTierMap();
    const flat = {};
    for (const [tierName, entries] of Object.entries(tierMap)) {
      for (const e of entries) {
        const key = `${e.provider}::${tierName}`;
        if (!(key in flat)) flat[key] = e.modelId; // first wins
      }
    }
    _modelByProviderTier = flat;
  }
  return (
    _modelByProviderTier[`${providerId}::${tier}`] ??
    _modelByProviderTier[`${providerId}::balanced`] ??
    null
  );
}

// =============================================================================
// SELECTION
// =============================================================================

export function selectProvider() {
  const explicit = process.env.WINDAGS_PROVIDER;
  if (explicit) {
    if (!(explicit in PROVIDER_HTTP)) {
      throw new Error(
        `WINDAGS_PROVIDER=${explicit} is not supported. Valid values: ${Object.keys(PROVIDER_HTTP).join(", ")}`,
      );
    }
    const envVar = PROVIDER_ENV_VARS[explicit];
    const altKey = explicit === "google" ? process.env.GEMINI_API_KEY : null;
    if (!process.env[envVar] && !altKey) {
      throw new Error(
        `WINDAGS_PROVIDER=${explicit} but ${envVar} is not set. ` +
          `Set ${envVar} (or unset WINDAGS_PROVIDER to auto-detect).`,
      );
    }
    return explicit;
  }

  // Auto-detect — accept GEMINI_API_KEY as an alias for GOOGLE_API_KEY.
  if (process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    process.env.GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
  }
  const detected = detectProviderFromEnv();
  if (!detected) {
    throw new Error(
      "No LLM provider configured. windags_run_pipeline needs one of: " +
        Object.values(PROVIDER_ENV_VARS).join(", ") +
        ". Set the env var on the MCP server process, or use the next_move " +
        "prompt instead and let your client's model do the inference.",
    );
  }
  if (!(detected in PROVIDER_HTTP)) {
    throw new Error(
      `Auto-detected provider '${detected}' has no HTTP transport configured in llm-client.js`,
    );
  }
  return detected;
}

// =============================================================================
// PROVIDER-SPECIFIC HTTP SHAPES
// =============================================================================

async function callAnthropic({ apiKey, model, systemPrompt, userMessage, maxTokens, baseUrl }) {
  const res = await fetch(`${baseUrl}/messages`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "(no body)");
    throw new Error(`Anthropic ${res.status} ${res.statusText}: ${body.slice(0, 500)}`);
  }
  const data = await res.json();
  const text = (data.content ?? [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
  return {
    text,
    usage: {
      input_tokens: data.usage?.input_tokens ?? 0,
      output_tokens: data.usage?.output_tokens ?? 0,
    },
  };
}

async function callOpenAICompat({ apiKey, model, systemPrompt, userMessage, maxTokens, baseUrl, supportsJsonMode }) {
  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  };
  // OpenAI native uses max_completion_tokens for newer models; compat
  // providers all still accept max_tokens. Send max_tokens for portability.
  body.max_tokens = maxTokens;
  if (supportsJsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "(no body)");
    throw new Error(`API ${res.status} ${res.statusText}: ${text.slice(0, 500)}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  return {
    text,
    usage: {
      input_tokens: data.usage?.prompt_tokens ?? 0,
      output_tokens: data.usage?.completion_tokens ?? 0,
    },
  };
}

async function callGoogle({ apiKey, model, systemPrompt, userMessage, maxTokens, baseUrl }) {
  const url = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  // Gemini 2.5 spends a "thoughts" budget before emitting output. With a low
  // maxOutputTokens cap it can return an empty content array (finishReason
  // MAX_TOKENS or STOP with thoughts only). Inflate the cap so the visible
  // output gets at least the requested budget after thinking.
  const inflatedMax = Math.max(maxTokens, maxTokens + 4096);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: {
        maxOutputTokens: inflatedMax,
        responseMimeType: "application/json",
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "(no body)");
    throw new Error(`Google ${res.status} ${res.statusText}: ${text.slice(0, 500)}`);
  }
  const data = await res.json();
  const candidate = data.candidates?.[0];
  const text = (candidate?.content?.parts ?? [])
    .map((p) => p.text ?? "")
    .join("");
  if (!text) {
    const finish = candidate?.finishReason ?? "(no candidate)";
    const thoughtsBudget = data.usageMetadata?.thoughtsTokenCount ?? 0;
    throw new Error(
      `Google returned empty content. finishReason=${finish}, thoughtsTokens=${thoughtsBudget}, ` +
        `requested maxOutputTokens=${inflatedMax}. Try a higher maxTokens or a flash model.`,
    );
  }
  return {
    text,
    usage: {
      input_tokens: data.usageMetadata?.promptTokenCount ?? 0,
      output_tokens: data.usageMetadata?.candidatesTokenCount ?? 0,
    },
  };
}

// =============================================================================
// PUBLIC ENTRY
// =============================================================================

/**
 * Run one LLM call. Provider and model are resolved from env + tier.
 * Returns { text, model, provider, usage, elapsed_ms }.
 */
export async function callLLM({ providerId, systemPrompt, userMessage, tier, maxTokens = 2048 }) {
  const provider = providerId ?? selectProvider();
  const transport = PROVIDER_HTTP[provider];
  if (!transport) {
    throw new Error(`No HTTP transport for provider '${provider}'`);
  }

  const envVar = PROVIDER_ENV_VARS[provider];
  const apiKey = process.env[envVar];
  if (!apiKey) {
    throw new Error(
      `${envVar} is not set. Required for provider '${provider}'. ` +
        `Set the env var or set WINDAGS_PROVIDER to a different provider.`,
    );
  }

  const model = modelFor(provider, tier);
  if (!model) {
    throw new Error(
      `No model registered for provider '${provider}' tier '${tier}'. ` +
        `Check provider-models.js — every supported provider needs at least a 'balanced' entry.`,
    );
  }

  const startMs = Date.now();
  let result;
  if (transport.kind === "anthropic") {
    result = await callAnthropic({ apiKey, model, systemPrompt, userMessage, maxTokens, baseUrl: transport.baseUrl });
  } else if (transport.kind === "google") {
    result = await callGoogle({ apiKey, model, systemPrompt, userMessage, maxTokens, baseUrl: transport.baseUrl });
  } else {
    // openai (native) and openai-compat both go through the OpenAI shape.
    // Native OpenAI supports response_format json_object; compat providers
    // mostly do too, but a few (xAI Grok) do not — keep it on, prompts
    // already say "Return ONLY JSON" so failures surface in extractJson.
    result = await callOpenAICompat({
      apiKey,
      model,
      systemPrompt,
      userMessage,
      maxTokens,
      baseUrl: transport.baseUrl,
      supportsJsonMode: true,
    });
  }

  return {
    text: result.text,
    model,
    provider,
    usage: result.usage,
    elapsed_ms: Date.now() - startMs,
  };
}

export function describeProvider(providerId) {
  return PROVIDER_DISPLAY_NAMES[providerId] ?? providerId;
}

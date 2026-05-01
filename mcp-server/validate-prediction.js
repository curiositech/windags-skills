/**
 * PredictedDAG schema (standalone, mirrors @workgroup-ai/core).
 *
 * Mirrored from packages/core/src/context/validate-prediction.ts so the
 * MCP can validate DAG JSON without pulling in the full core package.
 *
 * If the canonical schema in core changes, update this file too. Last sync:
 * 2026-04-30. The leniency (.default() on most fields) is intentional —
 * matches core's permissive design.
 */

import { z } from "zod";

const PreMortemRiskSchema = z.object({
  description: z.string().default(""),
  severity: z.enum(["low", "medium", "high"]).default("medium"),
  mitigation: z.string().optional(),
  affected_nodes: z.array(z.string()).default([]),
});

const PreMortemSummarySchema = z.object({
  recommendation: z
    .enum(["ACCEPT", "ACCEPT_WITH_MONITORING", "REVISE", "REJECT"])
    .default("ACCEPT_WITH_MONITORING"),
  risks: z.array(PreMortemRiskSchema).default([]),
});

const PredictedNodeSchema = z.object({
  id: z.string().min(1),
  skill_id: z.string().min(1),
  role_description: z.string().min(1),
  dependencies: z.array(z.string()).default([]),
  estimated_minutes: z.number().nonnegative().default(0),
  estimated_cost_usd: z.number().nonnegative().default(0),
  confidence: z.number().min(0).max(1).default(0.7),
  model_tier: z.enum(["fast", "balanced", "powerful"]).optional(),
  notes: z.string().optional(),
});

const PredictedWaveSchema = z.object({
  nodes: z.array(PredictedNodeSchema).default([]),
});

const TopologyTypeSchema = z.enum([
  "dag",
  "team-loop",
  "swarm",
  "blackboard",
  "team-builder",
  "recurring",
  "workflow",
]);

export const PredictedDAGSchema = z.object({
  title: z.string().min(1).default("Untitled prediction"),
  problem_classification: z
    .enum(["well-structured", "ill-structured", "wicked"])
    .default("well-structured"),
  confidence: z.number().min(0).max(1).default(0.7),
  halt_reason: z.string().optional().nullable().transform((v) => v ?? undefined),
  waves: z.array(PredictedWaveSchema).default([]),
  estimated_total_minutes: z.number().nonnegative().default(0),
  estimated_total_cost_usd: z.number().nonnegative().default(0),
  premortem: PreMortemSummarySchema.default({
    recommendation: "ACCEPT_WITH_MONITORING",
    risks: [],
  }),
  topology: TopologyTypeSchema.optional().nullable().default("dag"),
  topologyReason: z.string().optional().nullable().transform((v) => v ?? undefined),
});

/**
 * Validate a candidate PredictedDAG. Returns a discriminated union:
 *   { success: true, data, errors: [] }
 *   { success: false, data: null, errors: string[] }
 *
 * Errors are formatted as "path.to.field: message" for easy reading.
 */
export function validatePredictedDAG(input) {
  const result = PredictedDAGSchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data, errors: [] };
  }
  const errors = result.error.errors.map((e) => {
    const path = e.path.join(".");
    return path ? `${path}: ${e.message}` : e.message;
  });
  return { success: false, data: null, errors };
}

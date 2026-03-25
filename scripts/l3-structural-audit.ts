/**
 * L3 Structural Audit
 *
 * Grades skills on their Level 3 (reasoning strategy) content.
 * Based on the Three-Level Knowledge Architecture (Hoffman & Lintern):
 *   L1: Domain constraints (functional relationships, physical laws)
 *   L2: Concepts (categories, terminology, mental models)
 *   L3: Reasoning strategies (decision heuristics, perceptual cues, problem-solving logic)
 *
 * Most skills overindex on L2 (concepts) and underdeliver on L3 (reasoning).
 * This audit measures the L3 gap and produces a score + specific recommendations.
 *
 * Designed to run as a Haiku batch job: ~$0.002 per skill, < $1 for all 463.
 *
 * @module dag/skills/l3-structural-audit
 */

// =============================================================================
// L3 CRITERIA
// =============================================================================

/**
 * The five structural elements that make a skill actionable for agents.
 * Derived from analysis of the highest-performing skills in the library:
 * - api-architect (anti-patterns with symptom→fix)
 * - checklist-discipline (decision trees + progression timelines)
 * - drizzle-migrations (copy-paste-ready code for every case)
 * - cognitive-task-analysis (conditional logic frameworks)
 */
export interface L3Criteria {
  /**
   * DECISION POINTS: "When you see X, do Y not Z"
   *
   * Agents can't reason from first principles every time.
   * Decision points give them compiled expertise — the kind
   * that experts use unconsciously (Anderson's ACT-R procedural knowledge).
   *
   * Look for: if/then logic, decision trees, flowcharts, condition tables,
   * "when to use X vs Y", route selection criteria.
   *
   * Best example: checklist-discipline's DO-CONFIRM vs READ-DO decision tree
   */
  decisionPoints: L3Element;

  /**
   * FAILURE MODES: Symptom → Diagnosis → Fix
   *
   * Agents need to self-correct. Failure modes are the L3 reasoning
   * that Klein's RPD model calls "mental simulation" — the expert
   * imagines what will go wrong and checks for it proactively.
   *
   * Look for: anti-patterns, common mistakes, "don't do X because Y",
   * failure mode tables, symptom-fix pairs, shibboleth progressions.
   *
   * Best example: api-architect's anti-patterns with symptom→fix format
   */
  failureModes: L3Element;

  /**
   * WORKED EXAMPLES: Real scenarios with real trade-offs
   *
   * Pattern matching is how agents actually work. Worked examples
   * provide the case library that Klein's NDM framework shows
   * experts use for recognition-primed decisions.
   *
   * Look for: complete code examples, case studies, scenario walkthroughs,
   * reference implementations, template code, before/after comparisons.
   *
   * Best example: drizzle-migrations' full schema + migration for every common case
   */
  workedExamples: L3Element;

  /**
   * QUALITY GATES: "You're done when X is true"
   *
   * Agents don't naturally know when to stop. Quality gates
   * are the acceptance criteria that Polya's "Looking Back" phase
   * demands — explicit verification of completeness.
   *
   * Look for: checklists, validation criteria, "done when" conditions,
   * acceptance tests, quality rubrics, completion signals.
   *
   * Best example: api-architect's 19-item quality checklist
   */
  qualityGates: L3Element;

  /**
   * NOT-FOR BOUNDARIES: "Don't use this skill for Y"
   *
   * Prevents skill misapplication. This is the counterpart to
   * activation triggers — equally important for routing accuracy.
   * Without NOT-FOR boundaries, skills get applied too broadly
   * and fail in edge cases (Lakatos's monster-barring in reverse).
   *
   * Look for: "NOT for", "don't use when", "instead use X for Y",
   * explicit scope limitations, delegation to other skills.
   *
   * Best example: All well-structured skills have clear boundaries
   */
  notForBoundaries: L3Element;
}

export interface L3Element {
  /** Whether this element is present at all */
  present: boolean;

  /** Quality score (0-100) — present but weak scores low */
  score: number;

  /** Specific instances found */
  instances: string[];

  /** What's missing or could be improved */
  gaps: string[];
}

/**
 * Complete L3 audit result for a skill
 */
export interface L3AuditResult {
  skillId: string;
  /** Overall L3 coverage score (0-100) */
  overallScore: number;
  /** Letter grade */
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  /** Per-element scores */
  criteria: L3Criteria;
  /** Knowledge type balance estimate */
  knowledgeBalance: {
    /** Estimated % of content that is L1 (domain constraints) */
    l1Percent: number;
    /** Estimated % of content that is L2 (concepts) */
    l2Percent: number;
    /** Estimated % of content that is L3 (reasoning strategies) */
    l3Percent: number;
  };
  /** Actionable recommendations sorted by impact */
  recommendations: L3Recommendation[];
  /** Timestamp of audit */
  auditedAt: string;
}

export interface L3Recommendation {
  /** Which L3 element to improve */
  element: keyof L3Criteria;
  /** Priority: how much this would improve agent effectiveness */
  priority: 'critical' | 'high' | 'medium' | 'low';
  /** Specific action to take */
  action: string;
  /** Example of what good looks like (from best skills) */
  exemplar?: string;
}

// =============================================================================
// HAIKU AUDIT PROMPT
// =============================================================================

/**
 * System prompt for the Haiku L3 auditor.
 * This is the prompt that makes the $0.002-per-skill batch audit possible.
 */
export const L3_AUDIT_SYSTEM_PROMPT = `You are a skill quality auditor for an AI agent orchestration system.
Your job is to audit a skill's SKILL.md file for Level 3 (L3) procedural knowledge content.

Background:
- L1 = Domain constraints (physical laws, functional relationships)
- L2 = Concepts (categories, terminology, mental models — "knowing that")
- L3 = Reasoning strategies (decision heuristics, perceptual cues — "knowing how")

Most skills overindex on L2 and underdeliver on L3. Your job is to measure the gap.

Score each of 5 L3 elements (0-100):

1. DECISION POINTS: "When you see X, do Y not Z"
   - 0: No conditional logic anywhere
   - 30: Vague "consider X" without concrete branches
   - 60: Some if/then logic but incomplete
   - 80: Decision trees or condition tables covering main cases
   - 100: Comprehensive decision framework with edge cases

2. FAILURE MODES: Symptom → Diagnosis → Fix
   - 0: No anti-patterns or failure discussion
   - 30: Lists things to avoid without explaining symptoms
   - 60: Some anti-patterns with partial explanations
   - 80: Structured anti-patterns with symptom-fix pairs
   - 100: Full failure mode taxonomy with progression timelines

3. WORKED EXAMPLES: Real scenarios with trade-offs
   - 0: No examples at all
   - 30: Toy/trivial examples
   - 60: Some realistic examples but missing trade-off discussion
   - 80: Complete examples with trade-offs and alternatives
   - 100: Comprehensive case library covering common and edge scenarios

4. QUALITY GATES: "You're done when X is true"
   - 0: No completion criteria
   - 30: Vague "ensure quality" without specifics
   - 60: Some checklist items but incomplete
   - 80: Structured quality checklist covering main concerns
   - 100: Comprehensive validation rubric with automated checks

5. NOT-FOR BOUNDARIES: "Don't use this skill for Y"
   - 0: No scope limitations stated
   - 30: Vague scope without explicit exclusions
   - 60: Some "not for" items but missing delegation targets
   - 80: Clear exclusions with "use X instead" pointers
   - 100: Comprehensive scope with delegation map

Also estimate knowledge balance: what % is L1, L2, L3?

IMPORTANT: Keep string values SHORT (< 60 chars each). Limit instances and gaps to 2-3 items max.
Limit recommendations to 3 max. This keeps output within token limits.

Respond with ONLY valid JSON:
{
  "decisionPoints": { "present": bool, "score": 0-100, "instances": ["short desc"], "gaps": ["short desc"] },
  "failureModes": { "present": bool, "score": 0-100, "instances": ["short desc"], "gaps": ["short desc"] },
  "workedExamples": { "present": bool, "score": 0-100, "instances": ["short desc"], "gaps": ["short desc"] },
  "qualityGates": { "present": bool, "score": 0-100, "instances": ["short desc"], "gaps": ["short desc"] },
  "notForBoundaries": { "present": bool, "score": 0-100, "instances": ["short desc"], "gaps": ["short desc"] },
  "knowledgeBalance": { "l1Percent": number, "l2Percent": number, "l3Percent": number },
  "recommendations": [
    { "element": "elementName", "priority": "critical|high|medium|low", "action": "short action" }
  ]
}`;

/**
 * Build the user prompt for auditing a specific skill.
 */
export function buildL3AuditPrompt(skillId: string, skillBody: string): string {
  // Truncate very long skills to keep costs down
  const body = skillBody.length > 6000
    ? skillBody.slice(0, 6000) + '\n[...truncated at 6000 chars]'
    : skillBody;

  return `Audit this skill for L3 procedural knowledge content.

SKILL ID: ${skillId}

SKILL.md:
---
${body}
---

Score each L3 element and estimate knowledge balance. Respond with JSON only.`;
}

/**
 * Parse Haiku's audit response into a typed L3AuditResult.
 */
export function parseL3AuditResponse(skillId: string, responseText: string): L3AuditResult {
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`No JSON found in L3 audit response for ${skillId}`);
  }

  let jsonStr = jsonMatch[0];

  // Attempt to repair truncated JSON (common with max_tokens cutoff)
  const parsed = parseJsonRobust(jsonStr);

  const criteria: L3Criteria = {
    decisionPoints: normalizeElement(parsed.decisionPoints),
    failureModes: normalizeElement(parsed.failureModes),
    workedExamples: normalizeElement(parsed.workedExamples),
    qualityGates: normalizeElement(parsed.qualityGates),
    notForBoundaries: normalizeElement(parsed.notForBoundaries),
  };

  // Weighted average: decision points and failure modes matter most for agents
  const weights = {
    decisionPoints: 0.30,
    failureModes: 0.25,
    workedExamples: 0.20,
    qualityGates: 0.15,
    notForBoundaries: 0.10,
  };

  const overallScore = Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + criteria[key as keyof L3Criteria].score * weight;
  }, 0);

  const grade = scoreToGrade(overallScore);

  const recommendations: L3Recommendation[] = (parsed.recommendations ?? []).map((r: any) => ({
    element: r.element ?? 'decisionPoints',
    priority: r.priority ?? 'medium',
    action: r.action ?? '',
  }));

  return {
    skillId,
    overallScore: Math.round(overallScore),
    grade,
    criteria,
    knowledgeBalance: {
      l1Percent: parsed.knowledgeBalance?.l1Percent ?? 10,
      l2Percent: parsed.knowledgeBalance?.l2Percent ?? 60,
      l3Percent: parsed.knowledgeBalance?.l3Percent ?? 30,
    },
    recommendations,
    auditedAt: new Date().toISOString(),
  };
}

/**
 * Attempt to parse JSON robustly, handling common Haiku output issues:
 * - Truncated JSON from max_tokens cutoff
 * - Unescaped newlines in string values
 * - Trailing commas
 */
function parseJsonRobust(jsonStr: string): any {
  // First try direct parse
  try {
    return JSON.parse(jsonStr);
  } catch {
    // Try progressively more aggressive repairs
  }

  // Fix unescaped newlines inside string values
  let repaired = jsonStr.replace(/(?<=:\s*"[^"]*)\n([^"]*")/g, '\\n$1');

  try {
    return JSON.parse(repaired);
  } catch {
    // Continue
  }

  // Try truncation repair: close any unclosed arrays/objects
  repaired = repairTruncatedJson(repaired);

  try {
    return JSON.parse(repaired);
  } catch {
    // Continue
  }

  // Last resort: strip everything after the last complete key-value pair
  // Find the last valid closing brace or bracket pattern
  const lastGoodBrace = repaired.lastIndexOf('}');
  const lastGoodBracket = repaired.lastIndexOf(']');
  const cutPoint = Math.max(lastGoodBrace, lastGoodBracket);

  if (cutPoint > 0) {
    const truncated = repaired.slice(0, cutPoint + 1);
    const closers = countUnclosed(truncated);
    const fixed = truncated + closers;
    try {
      return JSON.parse(fixed);
    } catch {
      // Give up
    }
  }

  throw new Error(`Could not parse JSON (length: ${jsonStr.length}): ${jsonStr.slice(0, 100)}...`);
}

function repairTruncatedJson(str: string): string {
  // Remove trailing commas before closing braces/brackets
  let repaired = str.replace(/,\s*([}\]])/g, '$1');
  // Remove incomplete last key-value pair (trailing comma with no value)
  repaired = repaired.replace(/,\s*"[^"]*"\s*:\s*$/g, '');
  // Remove incomplete string values
  repaired = repaired.replace(/,\s*"[^"]*"\s*:\s*"[^"]*$/g, '');
  // Remove incomplete array elements
  repaired = repaired.replace(/,\s*"[^"]*$/g, '');

  return repaired + countUnclosed(repaired);
}

function countUnclosed(str: string): string {
  let braces = 0;
  let brackets = 0;
  let inString = false;
  let escape = false;

  for (const ch of str) {
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') braces++;
    if (ch === '}') braces--;
    if (ch === '[') brackets++;
    if (ch === ']') brackets--;
  }

  return ']'.repeat(Math.max(0, brackets)) + '}'.repeat(Math.max(0, braces));
}

function normalizeElement(raw: any): L3Element {
  return {
    present: raw?.present ?? false,
    score: clamp(raw?.score ?? 0, 0, 100),
    instances: Array.isArray(raw?.instances) ? raw.instances : [],
    gaps: Array.isArray(raw?.gaps) ? raw.gaps : [],
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

// =============================================================================
// BATCH AUDIT RUNNER
// =============================================================================

/**
 * Run L3 audit across multiple skills.
 * Designed for batch execution: processes sequentially to avoid rate limits,
 * reports progress via callback.
 *
 * @example
 * ```typescript
 * const results = await runL3Audit({
 *   skills: allSkills.map(s => ({ id: s.id, body: s.body })),
 *   callHaiku: async (prompt, system) => {
 *     const resp = await anthropic.messages.create({
 *       model: 'claude-haiku-4-5-20251001',
 *       max_tokens: 1024,
 *       system,
 *       messages: [{ role: 'user', content: prompt }],
 *     });
 *     return resp.content[0].text;
 *   },
 *   onProgress: (completed, total, latest) => {
 *     console.log(`[${completed}/${total}] ${latest.skillId}: ${latest.grade} (${latest.overallScore})`);
 *   },
 * });
 * ```
 */
export async function runL3Audit(options: {
  skills: Array<{ id: string; body: string }>;
  callHaiku: (prompt: string, systemPrompt: string) => Promise<string>;
  onProgress?: (completed: number, total: number, latest: L3AuditResult) => void;
  onError?: (skillId: string, error: Error) => void;
}): Promise<L3AuditResult[]> {
  const results: L3AuditResult[] = [];
  const total = options.skills.length;

  for (let i = 0; i < total; i++) {
    const skill = options.skills[i];

    try {
      const prompt = buildL3AuditPrompt(skill.id, skill.body);
      const response = await options.callHaiku(prompt, L3_AUDIT_SYSTEM_PROMPT);
      const result = parseL3AuditResponse(skill.id, response);

      results.push(result);
      options.onProgress?.(i + 1, total, result);
    } catch (error) {
      options.onError?.(
        skill.id,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  return results;
}

/**
 * Generate a summary report from audit results.
 * Useful for identifying which skills need CTA upgrades.
 */
export function summarizeAuditResults(results: L3AuditResult[]): {
  totalSkills: number;
  gradeDistribution: Record<string, number>;
  averageScore: number;
  averageL3Percent: number;
  /** Skills scoring below 50 — highest priority for CTA pipeline */
  criticalSkills: Array<{ skillId: string; score: number; topGap: string }>;
  /** Element with lowest average score across all skills */
  weakestElement: keyof L3Criteria;
} {
  const gradeDistribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  let totalScore = 0;
  let totalL3 = 0;

  const elementTotals: Record<keyof L3Criteria, number> = {
    decisionPoints: 0,
    failureModes: 0,
    workedExamples: 0,
    qualityGates: 0,
    notForBoundaries: 0,
  };

  for (const result of results) {
    gradeDistribution[result.grade]++;
    totalScore += result.overallScore;
    totalL3 += result.knowledgeBalance.l3Percent;

    for (const [key, element] of Object.entries(result.criteria)) {
      elementTotals[key as keyof L3Criteria] += element.score;
    }
  }

  const n = results.length || 1;

  const criticalSkills = results
    .filter(r => r.overallScore < 50)
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, 20)
    .map(r => ({
      skillId: r.skillId,
      score: r.overallScore,
      topGap: r.recommendations[0]?.action ?? 'No specific recommendation',
    }));

  // Find weakest element
  const weakestElement = (Object.entries(elementTotals) as [keyof L3Criteria, number][])
    .sort((a, b) => a[1] - b[1])[0][0];

  return {
    totalSkills: results.length,
    gradeDistribution,
    averageScore: Math.round(totalScore / n),
    averageL3Percent: Math.round(totalL3 / n),
    criticalSkills,
    weakestElement,
  };
}

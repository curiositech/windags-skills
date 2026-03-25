#!/usr/bin/env npx tsx
/**
 * CTA Skill Upgrade — Batch Runner
 *
 * Upgrades F-grade and D-grade skills by adding L3 procedural knowledge
 * (decision points, failure modes, worked examples, quality gates).
 *
 * Saves before/after artifacts to .windags/cta-upgrades/ for review.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/run-cta-upgrade.ts
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/run-cta-upgrade.ts --limit 10
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/run-cta-upgrade.ts --grade F
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/run-cta-upgrade.ts --grade FD  # Both F and D
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/run-cta-upgrade.ts --dry-run   # Don't write files
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

// =============================================================================
// CONFIG
// =============================================================================

const SKILLS_DIR = join(__dirname, '..', 'skills');
const AUDIT_FILE = join(__dirname, '..', '.windags', 'l3-audit', 'audit-2026-03-23.json');
const ARTIFACTS_DIR = join(__dirname, '..', '.windags', 'cta-upgrades');
const MODEL = 'claude-sonnet-4-20250514'; // Sonnet for quality rewrites
const MAX_TOKENS = 4096;
const BATCH_DELAY_MS = 500;

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

const CTA_SYSTEM_PROMPT = `You are a Cognitive Task Analysis (CTA) expert upgrading AI agent skills from concept dumps to procedural knowledge.

Your task: Rewrite a SKILL.md file to add Level 3 (L3) procedural content. The skill currently scores poorly because it describes WHAT things are (L2 concepts) but not HOW to decide what to do (L3 reasoning strategies).

RULES:
1. PRESERVE the YAML frontmatter exactly as-is (everything between the --- markers)
2. Keep the skill CONCISE — under 300 lines total
3. Replace L2 concept lists with L3 procedural content
4. Every skill MUST have these 5 elements:

DECISION POINTS (most important):
- Decision trees with explicit branches: "If X, do Y; if Z, do W"
- Cover the 3-5 most common situations an agent encounters with this skill
- Format as indented tree or table, not prose

FAILURE MODES (second most important):
- 3-5 anti-patterns in symptom → diagnosis → fix format
- Each must have a DETECTION RULE: "If you see X, you've hit this anti-pattern"
- Name each anti-pattern (e.g., "Rubber Stamp Review", "Schema Bloat")

WORKED EXAMPLES:
- At least 1 complete walkthrough of applying this skill to a real scenario
- Show decision points being navigated, not just final output
- Include what a novice would miss vs. what an expert catches

QUALITY GATES:
- Checklist of 5-10 conditions that define "this task is complete"
- Each must be testable/binary (can verify yes/no)
- Format as checkboxes: [ ] condition

NOT-FOR BOUNDARIES:
- What this skill should NOT be used for
- Where to delegate instead: "For X, use [other-skill] instead"

OUTPUT FORMAT: Return ONLY the complete rewritten SKILL.md content. Start with the YAML frontmatter (---). No explanation, no preamble.`;

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.indexOf('--limit');
  const limit = limitArg >= 0 ? parseInt(args[limitArg + 1], 10) : Infinity;
  const gradeArg = args.indexOf('--grade');
  const gradeFilter = gradeArg >= 0 ? args[gradeArg + 1] : 'F';
  const dryRun = args.includes('--dry-run');

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not set');
    process.exit(1);
  }
  const client = new Anthropic({ apiKey });

  // Load audit results
  if (!existsSync(AUDIT_FILE)) {
    console.error('Audit file not found. Run scripts/run-l3-audit.ts first.');
    process.exit(1);
  }

  const audit = JSON.parse(readFileSync(AUDIT_FILE, 'utf-8'));
  const targetGrades = gradeFilter.split('');

  // Filter to target grades
  const targets = audit.results
    .filter((r: any) => targetGrades.includes(r.grade))
    .sort((a: any, b: any) => a.overallScore - b.overallScore);

  const toUpgrade = targets.slice(0, limit);

  console.log(`\nCTA Skill Upgrade Pipeline`);
  console.log(`=========================`);
  console.log(`Target grades: ${targetGrades.join(', ')}`);
  console.log(`Skills matching: ${targets.length}`);
  console.log(`Upgrading: ${toUpgrade.length}`);
  console.log(`Model: ${MODEL}`);
  console.log(`Dry run: ${dryRun}`);
  console.log(`Estimated cost: ~$${(toUpgrade.length * 0.02).toFixed(2)}\n`);

  // Ensure artifact directory
  if (!existsSync(ARTIFACTS_DIR)) {
    mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }

  let upgraded = 0;
  let errors = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  const startTime = Date.now();

  for (let i = 0; i < toUpgrade.length; i++) {
    const auditResult = toUpgrade[i];
    const skillId = auditResult.skillId;
    const progress = `[${i + 1}/${toUpgrade.length}]`;

    // Read current SKILL.md
    const skillPath = join(SKILLS_DIR, skillId, 'SKILL.md');
    const skillPathLower = join(SKILLS_DIR, skillId, 'skill.md');
    const actualPath = existsSync(skillPath) ? skillPath : existsSync(skillPathLower) ? skillPathLower : null;

    if (!actualPath) {
      console.log(`${progress} ${skillId}: \x1b[33mSKIP\x1b[0m (no SKILL.md found)`);
      continue;
    }

    const currentContent = readFileSync(actualPath, 'utf-8');

    // Read references if they exist
    let referenceSummary = '';
    const refsDir = join(SKILLS_DIR, skillId, 'references');
    if (existsSync(refsDir)) {
      const refFiles = readdirSync(refsDir, { recursive: true })
        .filter((f: any) => String(f).endsWith('.md'))
        .slice(0, 3); // Max 3 reference files to keep prompt reasonable

      for (const refFile of refFiles) {
        const refPath = join(refsDir, String(refFile));
        if (existsSync(refPath)) {
          const refContent = readFileSync(refPath, 'utf-8');
          // Take first 1000 chars of each reference
          referenceSummary += `\n\n--- Reference: ${refFile} ---\n${refContent.slice(0, 1000)}`;
        }
      }
    }

    // Build the CTA upgrade prompt
    const auditGaps = auditResult.recommendations
      .map((r: any) => `- ${r.element} (${r.priority}): ${r.action}`)
      .join('\n');

    const prompt = `Upgrade this skill from ${auditResult.grade}-grade (score: ${auditResult.overallScore}/100) to B-grade.

CURRENT L3 AUDIT:
- Decision Points: ${auditResult.criteria.decisionPoints.score}/100 ${auditResult.criteria.decisionPoints.present ? '(present but weak)' : '(MISSING)'}
- Failure Modes: ${auditResult.criteria.failureModes.score}/100 ${auditResult.criteria.failureModes.present ? '(present but weak)' : '(MISSING)'}
- Worked Examples: ${auditResult.criteria.workedExamples.score}/100 ${auditResult.criteria.workedExamples.present ? '(present but weak)' : '(MISSING)'}
- Quality Gates: ${auditResult.criteria.qualityGates.score}/100 ${auditResult.criteria.qualityGates.present ? '(present but weak)' : '(MISSING)'}
- NOT-FOR Boundaries: ${auditResult.criteria.notForBoundaries.score}/100

SPECIFIC GAPS TO FIX:
${auditGaps}

CURRENT SKILL.md:
---
${currentContent}
---
${referenceSummary ? `\nREFERENCE MATERIAL (extract L3 reasoning from these):${referenceSummary}` : ''}

Rewrite the SKILL.md with all 5 L3 elements. Preserve the YAML frontmatter exactly. Return ONLY the complete file content.`;

    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: CTA_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      totalInputTokens += response.usage.input_tokens;
      totalOutputTokens += response.usage.output_tokens;

      // Validate the response starts with frontmatter
      if (!text.trim().startsWith('---')) {
        throw new Error('Response does not start with YAML frontmatter');
      }

      // Save artifact: before
      const artifactDir = join(ARTIFACTS_DIR, skillId);
      if (!existsSync(artifactDir)) {
        mkdirSync(artifactDir, { recursive: true });
      }
      writeFileSync(join(artifactDir, 'before.md'), currentContent);
      writeFileSync(join(artifactDir, 'after.md'), text);
      writeFileSync(join(artifactDir, 'audit.json'), JSON.stringify(auditResult, null, 2));

      // Write the upgraded skill (unless dry run)
      if (!dryRun) {
        writeFileSync(actualPath, text);
      }

      upgraded++;
      const beforeLines = currentContent.split('\n').length;
      const afterLines = text.split('\n').length;
      const delta = afterLines - beforeLines;
      const deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;

      console.log(`${progress} ${skillId}: \x1b[32m${auditResult.grade}→B\x1b[0m (${beforeLines}→${afterLines} lines, ${deltaStr}) | $${((response.usage.input_tokens / 1e6 * 3) + (response.usage.output_tokens / 1e6 * 15)).toFixed(3)}`);

    } catch (error) {
      errors++;
      const msg = error instanceof Error ? error.message : String(error);
      console.log(`${progress} ${skillId}: \x1b[31mERROR\x1b[0m ${msg.slice(0, 80)}`);
    }

    // Rate limit protection
    if (i < toUpgrade.length - 1) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const inputCost = (totalInputTokens / 1_000_000) * 3.00;
  const outputCost = (totalOutputTokens / 1_000_000) * 15.00;
  const totalCost = inputCost + outputCost;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`CTA UPGRADE COMPLETE`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Time: ${elapsed}s`);
  console.log(`Upgraded: ${upgraded} | Errors: ${errors}`);
  console.log(`Tokens: ${totalInputTokens.toLocaleString()} in / ${totalOutputTokens.toLocaleString()} out`);
  console.log(`Cost: $${totalCost.toFixed(2)} (input: $${inputCost.toFixed(2)}, output: $${outputCost.toFixed(2)})`);
  console.log(`\nArtifacts saved to: ${ARTIFACTS_DIR}`);
  console.log(`Each skill has: before.md, after.md, audit.json`);
  if (dryRun) {
    console.log(`\n⚠️  DRY RUN — no skills were modified. Review artifacts and re-run without --dry-run.`);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

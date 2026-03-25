#!/usr/bin/env npx tsx
/**
 * L3 Structural Audit — Batch Runner
 *
 * Audits all skills for Level 3 procedural knowledge content using Haiku.
 * Cost: ~$0.002 per skill × 471 skills ≈ $0.94
 *
 * Usage:
 *   npx tsx scripts/run-l3-audit.ts
 *   npx tsx scripts/run-l3-audit.ts --limit 10   # Test with first 10
 *   npx tsx scripts/run-l3-audit.ts --min-size 500  # Skip tiny skills
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

import {
  buildL3AuditPrompt,
  parseL3AuditResponse,
  summarizeAuditResults,
  L3_AUDIT_SYSTEM_PROMPT,
} from './l3-structural-audit';
import type { L3AuditResult } from './l3-structural-audit';

// =============================================================================
// CONFIG
// =============================================================================

const SKILLS_DIR = join(__dirname, '..', 'skills');
const OUTPUT_DIR = join(__dirname, '..', '.windags', 'l3-audit');
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 2048;
const BATCH_DELAY_MS = 200; // Rate limit protection

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.indexOf('--limit');
  const limit = limitArg >= 0 ? parseInt(args[limitArg + 1], 10) : Infinity;
  const minSizeArg = args.indexOf('--min-size');
  const minSize = minSizeArg >= 0 ? parseInt(args[minSizeArg + 1], 10) : 100;

  // Initialize Anthropic client
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not set');
    process.exit(1);
  }
  const client = new Anthropic({ apiKey });

  // Discover skills
  const skillDirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const skills: Array<{ id: string; body: string }> = [];

  for (const dir of skillDirs) {
    const skillPath = join(SKILLS_DIR, dir, 'SKILL.md');
    const skillPathLower = join(SKILLS_DIR, dir, 'skill.md');
    const path = existsSync(skillPath) ? skillPath : existsSync(skillPathLower) ? skillPathLower : null;

    if (!path) continue;

    const body = readFileSync(path, 'utf-8');
    if (body.length < minSize) continue;

    skills.push({ id: dir, body });
  }

  const toAudit = skills.slice(0, limit);
  console.log(`\nL3 Structural Audit`);
  console.log(`===================`);
  console.log(`Skills found: ${skills.length}`);
  console.log(`Auditing: ${toAudit.length}`);
  console.log(`Estimated cost: $${(toAudit.length * 0.002).toFixed(2)}`);
  console.log(`Model: ${MODEL}\n`);

  // Ensure output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Track results
  const results: L3AuditResult[] = [];
  let errors = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  const startTime = Date.now();

  // Grade counters for live display
  const grades: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };

  for (let i = 0; i < toAudit.length; i++) {
    const skill = toAudit[i];
    const progress = `[${i + 1}/${toAudit.length}]`;

    try {
      const prompt = buildL3AuditPrompt(skill.id, skill.body);

      const response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: L3_AUDIT_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      totalInputTokens += response.usage.input_tokens;
      totalOutputTokens += response.usage.output_tokens;

      const result = parseL3AuditResponse(skill.id, text);
      results.push(result);
      grades[result.grade]++;

      // Color code the grade
      const gradeColor = result.grade === 'A' ? '\x1b[32m' : // green
                         result.grade === 'B' ? '\x1b[36m' : // cyan
                         result.grade === 'C' ? '\x1b[33m' : // yellow
                         result.grade === 'D' ? '\x1b[35m' : // magenta
                         '\x1b[31m'; // red
      const reset = '\x1b[0m';

      console.log(`${progress} ${skill.id}: ${gradeColor}${result.grade}${reset} (${result.overallScore}) | L3: ${result.knowledgeBalance.l3Percent}%`);

    } catch (error) {
      errors++;
      const msg = error instanceof Error ? error.message : String(error);
      console.log(`${progress} ${skill.id}: \x1b[31mERROR\x1b[0m ${msg.slice(0, 80)}`);
    }

    // Rate limit protection
    if (i < toAudit.length - 1) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  // Compute summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const inputCost = (totalInputTokens / 1_000_000) * 0.80;
  const outputCost = (totalOutputTokens / 1_000_000) * 4.00;
  const totalCost = inputCost + outputCost;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`AUDIT COMPLETE`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Time: ${elapsed}s`);
  console.log(`Skills audited: ${results.length} | Errors: ${errors}`);
  console.log(`Tokens: ${totalInputTokens.toLocaleString()} in / ${totalOutputTokens.toLocaleString()} out`);
  console.log(`Cost: $${totalCost.toFixed(4)} (input: $${inputCost.toFixed(4)}, output: $${outputCost.toFixed(4)})`);
  console.log();

  // Grade distribution
  console.log(`Grade Distribution:`);
  const bar = (n: number, total: number) => {
    const pct = total > 0 ? (n / total) * 100 : 0;
    const blocks = Math.round(pct / 2);
    return '#'.repeat(blocks) + ' '.repeat(50 - blocks) + ` ${n} (${pct.toFixed(0)}%)`;
  };
  console.log(`  A: ${bar(grades.A, results.length)}`);
  console.log(`  B: ${bar(grades.B, results.length)}`);
  console.log(`  C: ${bar(grades.C, results.length)}`);
  console.log(`  D: ${bar(grades.D, results.length)}`);
  console.log(`  F: ${bar(grades.F, results.length)}`);

  // Full summary
  if (results.length > 0) {
    const summary = summarizeAuditResults(results);
    console.log(`\nAverage L3 Score: ${summary.averageScore}/100`);
    console.log(`Average L3 Content: ${summary.averageL3Percent}%`);
    console.log(`Weakest Element: ${summary.weakestElement}`);

    if (summary.criticalSkills.length > 0) {
      console.log(`\nCritical Skills (score < 50, highest priority for CTA):`);
      for (const skill of summary.criticalSkills.slice(0, 15)) {
        console.log(`  ${skill.score.toString().padStart(3)} | ${skill.skillId}`);
        console.log(`      Gap: ${skill.topGap.slice(0, 80)}`);
      }
    }

    // Write results to file
    const outputFile = join(OUTPUT_DIR, `audit-${new Date().toISOString().slice(0, 10)}.json`);
    writeFileSync(outputFile, JSON.stringify({
      meta: {
        date: new Date().toISOString(),
        skillsAudited: results.length,
        errors,
        totalCostUsd: totalCost,
        tokens: { input: totalInputTokens, output: totalOutputTokens },
        elapsedSeconds: parseFloat(elapsed),
      },
      summary,
      results: results.sort((a, b) => a.overallScore - b.overallScore),
    }, null, 2));

    console.log(`\nFull results written to: ${outputFile}`);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

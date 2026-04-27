#!/usr/bin/env tsx
/**
 * dump-attribution.ts
 *
 * Inspect the attribution DB. Shows observation counts, mean quality,
 * and (when given a task description) k-NN neighbors for a skill.
 *
 * Usage:
 *   tsx skills/next-move/scripts/dump-attribution.ts <skill-id>
 *   tsx skills/next-move/scripts/dump-attribution.ts <skill-id> "<task description>"
 *   tsx skills/next-move/scripts/dump-attribution.ts --all
 */

import { getAttributionDB } from '../../../packages/core/src/retrieval/attribution-db';
import { embedTask } from '../../../packages/core/src/retrieval/task-embedder';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === '--help') {
    console.error(`Usage:
  dump-attribution.ts <skill-id>                       — show observation count + mean quality
  dump-attribution.ts <skill-id> "<task description>"  — k-NN scoring against the task
  dump-attribution.ts --all                            — list all skills with observations`);
    process.exit(1);
  }

  const db = getAttributionDB();
  if (!db.isEnabled) {
    console.error('Attribution DB is disabled (better-sqlite3 not available or DB corrupt).');
    console.error('Path: ~/.windags/skill-state.db');
    process.exit(2);
  }

  if (args[0] === '--all') {
    // List all skills via getMeanQuality across the catalog
    // (no direct "list skills with obs" API yet; we approximate with a dump)
    const allSkills = listAllSkills(db);
    if (allSkills.length === 0) {
      console.log('No observations recorded yet.');
      return;
    }
    console.log(`Skills with observations (${allSkills.length}):`);
    for (const { skillId, count } of allSkills) {
      const mean = db.getMeanQuality(skillId);
      const meanStr = mean
        ? `acc=${mean.accuracy.toFixed(2)} comp=${mean.completeness.toFixed(2)} rel=${mean.relevance.toFixed(2)}`
        : '(no quality data)';
      console.log(`  ${skillId.padEnd(40)} obs=${String(count).padStart(4)}  ${meanStr}`);
    }
    return;
  }

  const skillId = args[0];
  const taskDescription = args[1];

  const count = db.getObservationCount(skillId);
  console.log(`Skill:           ${skillId}`);
  console.log(`Observations:    ${count}`);

  if (count === 0) {
    console.log('No observations recorded for this skill yet.');
    return;
  }

  const mean = db.getMeanQuality(skillId);
  if (mean) {
    console.log('Mean quality (context-free):');
    console.log(`  accuracy:     ${mean.accuracy.toFixed(3)}`);
    console.log(`  completeness: ${mean.completeness.toFixed(3)}`);
    console.log(`  relevance:    ${mean.relevance.toFixed(3)}`);
    console.log(`  structure:    ${mean.structure.toFixed(3)}`);
    console.log(`  usability:    ${mean.usability.toFixed(3)}`);
  }

  if (taskDescription) {
    console.log();
    console.log(`Task: "${taskDescription}"`);
    const embedding = await embedTask(taskDescription);
    if (!embedding) {
      console.log('  (Embedder unavailable — install @huggingface/transformers for k-NN scoring)');
      return;
    }
    const knn = db.scoreSkill(skillId, embedding);
    if (!knn) {
      console.log('  No scoring data for this skill.');
      return;
    }
    console.log(`Neighbors used:  ${knn.neighborsUsed}/${knn.observationCount}`);
    console.log(`Avg similarity:  ${knn.avgSimilarity.toFixed(3)}`);
    console.log(`Confidence:      ${knn.confidence.toFixed(3)}`);
    console.log('Predicted (similarity-weighted):');
    console.log(`  accuracy:     ${knn.predicted.accuracy.toFixed(3)}`);
    console.log(`  completeness: ${knn.predicted.completeness.toFixed(3)}`);
    console.log(`  relevance:    ${knn.predicted.relevance.toFixed(3)}`);
    console.log(`  structure:    ${knn.predicted.structure.toFixed(3)}`);
    console.log(`  usability:    ${knn.predicted.usability.toFixed(3)}`);
    if (knn.avgToolCallRate !== null) {
      console.log(`Avg tool-call rate: ${knn.avgToolCallRate.toFixed(3)}`);
    }
    if (knn.avgOutputSimilarity !== null) {
      console.log(`Avg output similarity: ${knn.avgOutputSimilarity.toFixed(3)}`);
    }
    if (knn.avgSelfReportedReliance !== null) {
      console.log(`Avg self-reported reliance: ${knn.avgSelfReportedReliance.toFixed(3)}`);
    }
  }
}

function listAllSkills(db: ReturnType<typeof getAttributionDB>): Array<{ skillId: string; count: number }> {
  // Reach into the underlying DB via getObservationCount per skill.
  // We approximate by querying the raw SQL through a public-ish path:
  // there's no list-distinct-skills API, so we read the file system.
  const internal = (db as unknown as { db?: { prepare: (s: string) => { all: () => unknown[] } } }).db;
  if (!internal) return [];
  try {
    const rows = internal.prepare(
      'SELECT skill_id, COUNT(*) as cnt FROM observations GROUP BY skill_id ORDER BY cnt DESC'
    ).all() as Array<{ skill_id: string; cnt: number }>;
    return rows.map((r) => ({ skillId: r.skill_id, count: r.cnt }));
  } catch {
    return [];
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

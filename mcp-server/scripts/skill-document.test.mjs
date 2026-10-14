import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseSkillDocument } from "../skill-document.js";
import { readUserSkillFile } from "../user-skills.js";

const source = "---\nname: fixture\ndescription: |\n  Candidate-selected practice.\nmetadata:\n  pairs-with:\n    - skill: tech-presentation-interview\n---\n# Body\n\nEvidence only.\n";

for (const ending of ["\n", "\r\n"]) {
  test("parses frontmatter and preserves body with " + JSON.stringify(ending), () => {
    const parsed = parseSkillDocument(source.replaceAll("\n", ending));
    assert.equal(parsed.frontmatter.name, "fixture");
    assert.equal(parsed.frontmatter.description, "Candidate-selected practice.\n");
    assert.equal(parsed.frontmatter.metadata["pairs-with"][0].skill, "tech-presentation-interview");
    assert.equal(parsed.body, ("# Body\n\nEvidence only.\n").replaceAll("\n", ending));
  });
}

test("a CRLF interview entry retains every direct specialist relationship", () => {
  const raw = fs.readFileSync(new URL("../../skills/interview-simulator/SKILL.md", import.meta.url), "utf8");
  const lf = parseSkillDocument(raw.replaceAll("\r\n", "\n"));
  const crlf = parseSkillDocument(raw.replaceAll("\r\n", "\n").replaceAll("\n", "\r\n"));
  assert.deepEqual(crlf.frontmatter, lf.frontmatter);
  assert.equal(crlf.frontmatter.metadata["pairs-with"].length, 7);
});

test("missing delimiters, malformed YAML, and scalar frontmatter stay unavailable", () => {
  for (const raw of ["# No frontmatter", "---\nname: [\n---\nbody", "---\ntrue\n---\nbody"]) {
    assert.equal(parseSkillDocument(raw), null);
  }
});

test("an installed CRLF skill remains available to the graft reader", () => {
  const scratch = path.join(os.homedir(), "coding", "tmp");
  fs.mkdirSync(scratch, { recursive: true });
  const dir = fs.mkdtempSync(path.join(scratch, "interview-crlf-"));
  try {
    const skillPath = path.join(dir, "SKILL.md");
    fs.writeFileSync(skillPath, source.replaceAll("\n", "\r\n"));
    const parsed = readUserSkillFile(skillPath);
    assert.equal(parsed.frontmatter.name, "fixture");
    assert.equal(parsed.frontmatter.metadata["pairs-with"][0].skill, "tech-presentation-interview");
    assert.ok(parsed.body.startsWith("# Body\r\n"));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

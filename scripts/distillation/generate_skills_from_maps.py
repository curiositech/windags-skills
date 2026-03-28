#!/usr/bin/env python3
"""
Generate skill drafts from existing knowledge maps.

Processes knowledge maps that already exist and generates SKILL.md files,
skipping the expensive Pass 1 and Pass 2.

Usage:
  python generate_skills_from_maps.py [--output-dir ./output]
"""

import os
import json
import asyncio
import argparse
from pathlib import Path
import httpx
from anthropic import AsyncAnthropic

# ============================================================================
# Skill Draft Prompt (same as distill.py Pass 3)
# ============================================================================

SKILL_DRAFT_PROMPT = """You are skill-architect — the authoritative meta-skill for creating expert-level Agent Skills.

## Your Philosophy

Great skills are progressive disclosure machines. They encode REAL domain expertise (shibboleths), not surface instructions. They follow a three-layer architecture:
1. **Lightweight metadata** (YAML frontmatter) for discovery and activation
2. **Lean SKILL.md** (<500 lines) for core process — decision trees, not prose
3. **Reference files** for deep dives, loaded only on demand

## What Separates Great Skills from Mediocre Ones

- **Decision trees, not prose**: Every core process must be executable branches (if X then Y), not narrative explanation
- **Shibboleths**: Anti-patterns that reveal whether someone has deeply internalized the expertise vs. read the summary. Include the Novice/Expert/Timeline template
- **Progressive disclosure**: SKILL.md gives the 80% case. Reference files handle the 20%
- **Mermaid diagrams**: Use flowchart, sequence, or state diagrams for complex processes — they're rendered natively
- **Strong NOT-FOR boundaries**: Explicit exclusions prevent false activation. Formula: [What it does][When to use it]. NOT for [3-5 explicit exclusions]
- **Temporal knowledge**: When paradigms shifted, what changed, what the pre-shift mistake looks like

## The SKILL.md Template

```markdown
---
name: [lowercase-hyphenated — derived from domain, not book title]
description: "[What it does] [When to use]. NOT for [exclusions]."
category: [one of: Code Quality & Testing, Research & Academic, Architecture & Design, Agent & Orchestration, DevOps & Infrastructure, Frontend & UI, Data & Analytics, Security & Compliance, Productivity & Meta]
tags: [3-7 domain keywords]
allowed-tools: Read
---

# [Skill Name — Human-Readable Title]

[One sentence: what this skill enables an agent to DO, not what the book is ABOUT]

## When to Use

✅ **Use for:**
- [Specific scenario 1]
- [Specific scenario 2]
- [Specific scenario 3]

❌ **NOT for:**
- [Adjacent domain this doesn't cover]
- [Common confusion]
- [Related skill that handles this instead]

## Core Process

[Decision trees using Mermaid flowcharts or indented branch notation]

## Anti-Patterns

### [Anti-Pattern Name]
**Novice behavior**: [What beginners do wrong]
**Expert behavior**: [What practitioners actually do]
**Timeline**: [When the field shifted]
**Detection rule**: [How to spot this in practice]

## Reference Files

| File | When to Load |
|------|-------------|
| `references/[topic].md` | [Specific condition that triggers loading] |
```

## Critical Quality Requirements

1. SKILL.md must be under 500 lines
2. At least 2 anti-patterns using Novice/Expert/Timeline template
3. Decision trees, not paragraphs
4. Source attribution in References section
5. Description follows: [What][When]NOT[Exclusions]

Now create a production-quality SKILL.md from this knowledge map:

"""


async def generate_skill_draft(client, knowledge_map: dict) -> dict:
    """Generate a SKILL.md from a knowledge map using Sonnet."""
    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8000,
        messages=[{
            "role": "user",
            "content": SKILL_DRAFT_PROMPT + json.dumps(knowledge_map, indent=2)
        }]
    )

    return {
        "skill_md": response.content[0].text,
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens,
    }


async def process_knowledge_maps(output_dir: str):
    """Find all knowledge maps without corresponding SKILL.md files and generate them."""
    import sys

    def log(msg):
        print(msg, flush=True)
        sys.stdout.flush()

    log("=" * 70)
    log("SKILL DRAFT GENERATOR - Starting")
    log("=" * 70)

    client = AsyncAnthropic(
        max_retries=3,
        http_client=httpx.AsyncClient(timeout=httpx.Timeout(300.0, connect=30.0)),
    )
    output_path = Path(output_dir)

    if not output_path.exists():
        log(f"Output directory not found: {output_dir}")
        log("Run distill.py first to generate knowledge maps.")
        sys.exit(1)

    knowledge_maps = list(output_path.glob("*_knowledge_map.json"))
    log(f"Found {len(knowledge_maps)} knowledge maps")

    # Filter to only those without SKILL.md
    to_process = []
    for km_path in knowledge_maps:
        filename = km_path.stem.replace("_knowledge_map", "")
        skill_path = output_path / f"{filename}_SKILL.md"

        if not skill_path.exists():
            to_process.append((km_path, skill_path, filename))
            log(f"  -> Need to generate: {filename}")
        else:
            log(f"  ok Already exists: {filename}")

    log(f"\n{'=' * 70}")
    log(f"SUMMARY: Need to generate {len(to_process)} skill drafts")
    log(f"{'=' * 70}\n")

    if not to_process:
        log("All skill drafts already exist!")
        return

    total_cost = 0.0
    successful = 0
    failed = 0

    for i, (km_path, skill_path, filename) in enumerate(to_process, 1):
        log(f"\n{'=' * 70}")
        log(f"[{i}/{len(to_process)}] Processing: {filename}")
        log(f"{'=' * 70}")

        try:
            log(f"  Loading knowledge map from {km_path.name}...")
            with open(km_path, 'r') as f:
                knowledge_map = json.load(f)

            log(f"  Calling Anthropic API (Sonnet)...")
            result = await generate_skill_draft(client, knowledge_map)

            # Sonnet: $3/MTok in, $15/MTok out
            cost = (result["input_tokens"] * 3.00 + result["output_tokens"] * 15.00) / 1_000_000
            total_cost += cost

            log(f"  Saving skill draft to {skill_path.name}...")
            with open(skill_path, 'w') as f:
                f.write(result["skill_md"])

            log(f"\n  SUCCESS: ${cost:.4f} ({result['input_tokens']:,} in + {result['output_tokens']:,} out)")
            successful += 1

        except Exception as e:
            log(f"\n  ERROR: {type(e).__name__}: {e}")
            failed += 1

            if "credit balance" in str(e).lower():
                log(f"\nAPI credit exhausted after {successful} successful completions")
                break

    log(f"\n{'='*70}")
    log(f"FINAL: {successful}/{len(to_process)} generated, {failed} failed, ${total_cost:.4f} total")
    log(f"{'='*70}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate skill drafts from knowledge maps")
    parser.add_argument("--output-dir", default="./output",
                        help="Directory containing knowledge maps (default: ./output)")
    args = parser.parse_args()
    asyncio.run(process_knowledge_maps(args.output_dir))

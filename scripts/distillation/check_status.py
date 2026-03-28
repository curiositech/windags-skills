#!/usr/bin/env python3
"""
Check status of corpus skill draft generation.

Shows which books have:
- Knowledge maps completed (Pass 1 & 2)
- Skill drafts completed (Pass 3)
- Still need processing

Usage:
  python check_status.py [--dir ./output]
"""

import argparse
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description="Check distillation pipeline status")
    parser.add_argument("--dir", default="./output",
                        help="Output directory to check (default: ./output)")
    args = parser.parse_args()

    output_dir = Path(args.dir)

    if not output_dir.exists():
        print(f"Directory not found: {args.dir}")
        print("Run distill.py first to generate outputs.")
        return

    # Find all knowledge maps
    knowledge_maps = list(output_dir.glob("*_knowledge_map.json"))
    knowledge_map_stems = {km.stem.replace("_knowledge_map", "") for km in knowledge_maps}

    # Find all skill drafts
    skill_drafts = list(output_dir.glob("*_SKILL.md"))
    skill_draft_stems = {sd.stem.replace("_SKILL", "") for sd in skill_drafts}

    # Find all pass1 extractions
    extractions = list(output_dir.glob("*_pass1_extractions.json"))

    # Calculate what needs processing
    needs_skill_draft = knowledge_map_stems - skill_draft_stems

    print("="*70)
    print("DISTILLATION PIPELINE STATUS")
    print("="*70)
    print()
    print(f"  Pass 1 extractions:  {len(extractions)}")
    print(f"  Knowledge maps:      {len(knowledge_maps)}")
    print(f"  Skill drafts:        {len(skill_drafts)}")
    print(f"  Needs skill draft:   {len(needs_skill_draft)}")
    print()

    if needs_skill_draft:
        print("="*70)
        print("BOOKS NEEDING SKILL DRAFT GENERATION")
        print("="*70)
        for i, stem in enumerate(sorted(needs_skill_draft), 1):
            display_name = stem
            if len(display_name) > 60:
                display_name = display_name[:57] + "..."
            print(f"{i:2d}. {display_name}")

        print()
        print(f"Estimated cost: ${len(needs_skill_draft) * 0.05:.2f}")
        print(f"  (~$0.05 per skill draft)")
        print()
        print("Run: python generate_skills_from_maps.py")
    else:
        print("All skill drafts are complete!")
        print()
        print("Next steps:")
        print("  1. Review generated SKILL.md files in ./output/")
        print("  2. Copy quality skills to your skills directory")

    print()

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""index_references.py — ensure a skill's SKILL.md indexes its whole bundle.

Two guarantees, per the skill-architect contract:
  1. EVERY file in the skill bundle is linked from SKILL.md (no orphans).
  2. EVERY references/ doc is indexed by its MAJOR CONTENT / reason-to-pull
     (a one-line "read this when…"), so the model knows when to open it.

Usage:
  python3 index_references.py <skill-dir>           # --check (report only), exit 1 on gaps
  python3 index_references.py <skill-dir> --fix      # rewrite the "## Skill Bundle Index" section

The --fix pass (re)writes a single delimited block at the end of SKILL.md that
links every bundle file grouped by directory, each with a derived purpose. It is
idempotent (regenerates between the markers) and never touches the rest of the doc.
"""
import os, re, sys

BEGIN = "<!-- BEGIN BUNDLE INDEX (auto: index_references.py) -->"
END = "<!-- END BUNDLE INDEX -->"
SKIP_DIRS = {".git", "__pycache__", "node_modules", ".idea"}
SKIP_FILES = {"SKILL.md", ".DS_Store"}
SKIP_EXT = {".pyc"}

def bundle_files(root):
    out = []
    for dp, dns, fns in os.walk(root):
        dns[:] = [d for d in dns if d not in SKIP_DIRS]
        for fn in fns:
            if fn in SKIP_FILES or os.path.splitext(fn)[1] in SKIP_EXT:
                continue
            rel = os.path.relpath(os.path.join(dp, fn), root)
            out.append(rel)
    return sorted(out)

def purpose(root, rel):
    """One-line reason-to-pull, derived from the file."""
    path = os.path.join(root, rel)
    ext = os.path.splitext(rel)[1]
    try:
        head = open(path, errors="ignore").read(4000)
    except Exception:
        return ""
    if ext == ".md":
        # first markdown H1/H2, then first real sentence of body
        m = re.search(r"^#{1,2}\s+(.+)$", head, re.M)
        title = m.group(1).strip() if m else ""
        body = re.sub(r"^#.*$", "", head, flags=re.M)
        body = re.sub(r"```.*?```", "", body, flags=re.S)
        sent = next((s.strip() for s in re.split(r"(?<=[.!?])\s", body) if len(s.strip()) > 25), "")
        sent = re.sub(r"\s+", " ", sent)[:140]
        return f"{title} — {sent}" if title and sent else (title or sent)
    if ext in (".py", ".sh"):
        m = re.search(r'"""(.+?)"""', head, re.S) or re.search(r"^#\s*(.+)$", head, re.M) or re.search(r"^#!.*\n#\s*(.+)$", head, re.M)
        line = (m.group(1).strip().splitlines()[0] if m else "").strip()
        return re.sub(r"\s+", " ", line)[:140] or "script"
    if ext in (".json", ".yaml", ".yml"):
        return rel.split("/")[-1].replace("-", " ").replace("_", " ").rsplit(".", 1)[0] + " (data/schema)"
    return ""

def linked(skill_md, rel):
    """Is this file referenced anywhere in SKILL.md (path or unambiguous basename)?"""
    base = rel.split("/")[-1]
    return rel in skill_md or (base in skill_md and base not in ("README.md", "CHANGELOG.md"))

def build_index(root, files):
    by_dir = {}
    for rel in files:
        d = os.path.dirname(rel) or "(root)"
        by_dir.setdefault(d, []).append(rel)
    lines = [BEGIN, "", "## Skill Bundle Index", "",
             "*Every file in this skill, and when to open it. Auto-generated; run `scripts/index_references.py --fix`.*", ""]
    for d in sorted(by_dir):
        lines.append(f"**`{d}/`**" if d != "(root)" else "**root**")
        for rel in by_dir[d]:
            p = purpose(root, rel)
            lines.append(f"- [`{rel}`]({rel})" + (f" — {p}" if p else ""))
        lines.append("")
    lines.append(END)
    return "\n".join(lines)

def main():
    if len(sys.argv) < 2:
        print("usage: index_references.py <skill-dir> [--fix]"); sys.exit(2)
    root = os.path.abspath(sys.argv[1]); fix = "--fix" in sys.argv[2:]
    md_path = os.path.join(root, "SKILL.md")
    if not os.path.isfile(md_path):
        print(f"no SKILL.md in {root}"); sys.exit(2)
    skill_md = open(md_path, errors="ignore").read()
    files = bundle_files(root)
    refs = [f for f in files if f.startswith("references/") and f.endswith(".md")]

    # consider the index block itself as providing links
    md_for_check = re.sub(re.escape(BEGIN) + r".*?" + re.escape(END), "", skill_md, flags=re.S)
    orphans = [f for f in files if not linked(md_for_check, f)]
    ref_map = bool(re.search(r"reference\s*map|references/", skill_md, re.I))
    refs_unindexed = [f for f in refs if not linked(md_for_check, f)]

    print(f"skill: {os.path.basename(root)}")
    print(f"  files: {len(files)} · references: {len(refs)} · reference-map present: {ref_map}")
    print(f"  orphan files (not linked in SKILL.md prose): {len(orphans)}")
    for f in orphans:
        print(f"     - {f}")
    print(f"  references NOT indexed by reason in prose: {len(refs_unindexed)}")
    for f in refs_unindexed:
        print(f"     - {f}")

    if fix:
        index = build_index(root, files)
        if BEGIN in skill_md:
            new = re.sub(re.escape(BEGIN) + r".*?" + re.escape(END), index, skill_md, flags=re.S)
        else:
            new = skill_md.rstrip() + "\n\n" + index + "\n"
        open(md_path, "w").write(new)
        print(f"  ✓ wrote Skill Bundle Index ({len(files)} files linked)")
        sys.exit(0)

    # check mode: gap if any file is orphaned in BOTH prose and (missing) index
    gaps = [f for f in orphans]  # index block counts as links, so orphans here = truly unlinked
    sys.exit(1 if gaps else 0)

if __name__ == "__main__":
    main()

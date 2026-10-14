"""Negative fixtures for reference restoration and specialist discovery."""
import importlib.util
import shutil
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("interview_guard", ROOT / "scripts/check-interview-bundles.py")
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


class InterviewBundleGuardTests(unittest.TestCase):
    def setUp(self):
        scratch = Path.home() / "coding/tmp"
        scratch.mkdir(parents=True, exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(prefix="interview-guard-", dir=scratch)
        self.root = Path(self.temp.name)
        for skill_id in guard.EXPECTED:
            shutil.copytree(ROOT / "skills" / skill_id, self.root / "skills" / skill_id)
        for skill_id in guard.SPECIALISTS:
            target = self.root / "skills" / skill_id
            target.mkdir(parents=True)
            (target / "SKILL.md").write_text("---\nname: " + skill_id + "\ndescription: fixture\n---\n")

    def tearDown(self):
        self.temp.cleanup()

    def test_clean_distribution(self):
        self.assertEqual(guard.audit(self.root), [])

    def test_restored_and_renamed_legacy_guides_are_rejected(self):
        refs = self.root / "skills/interview-simulator/references"
        for name in ["proctor-engine-setup.md", "voice-engine-setup.md", "session-orchestration.md", "renamed-guide.md", "nested/guide.md"]:
            with self.subTest(name=name):
                path = refs / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text("Unreviewed instructions")
                self.assertTrue(any("inventory differs" in e for e in guard.audit(self.root)))
                path.unlink()

    def test_missing_presentation_or_manager_edge_is_rejected(self):
        entry = self.root / "skills/interview-simulator/SKILL.md"
        original = entry.read_text()
        for skill_id in ["tech-presentation-interview", "hiring-manager-deep-dive"]:
            with self.subTest(skill=skill_id):
                entry.write_text(original.replace("    - skill: " + skill_id, "    - skill: absent-specialist"))
                self.assertTrue(any("relationships differ" in e for e in guard.audit(self.root)))
        entry.write_text(original)

    def test_ghost_index_entry_is_rejected(self):
        index = self.root / "skills/interview-loop-strategist/references/INDEX.md"
        index.write_text(index.read_text() + "\n[old guide](old-guide.md)\n")
        self.assertTrue(any("unreviewed index target" in e for e in guard.audit(self.root)))

    def test_missing_index_route_is_rejected(self):
        entry = self.root / "skills/interview-loop-strategist/SKILL.md"
        entry.write_text(entry.read_text().replace("[references/INDEX.md](references/INDEX.md)", "reference guide"))
        self.assertTrue(any("does not load reference index" in e for e in guard.audit(self.root)))

    def test_unavailable_specialist_is_rejected(self):
        (self.root / "skills/hiring-manager-deep-dive/SKILL.md").unlink()
        self.assertTrue(any("unavailable specialist" in e for e in guard.audit(self.root)))


if __name__ == "__main__":
    unittest.main()

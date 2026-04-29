#!/usr/bin/env python3
"""Audit a web app for ideal-web-app-builder contract drift.

This is a heuristic scanner. It catches common failures early; it does not
replace visual review, accessibility testing, Storybook, or performance audits.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable


PROD_EXTS = {".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".mdx"}
COMPONENT_EXTS = {".tsx", ".jsx"}
SKIP_DIRS = {
    ".git",
    ".next",
    ".nuxt",
    ".output",
    "node_modules",
    "coverage",
    "dist",
    "build",
    "out",
    "storybook-static",
}
TOKEN_PATH_HINTS = (
    "token",
    "theme",
    "tailwind.config",
    "globals.css",
    "global.css",
    "variables.css",
    "design-system",
    "brand.css",
)
PROD_PATH_HINTS = (
    "src",
    "app",
    "pages",
    "components",
    "features",
    "ui",
)
PRIMITIVE_PATH_HINTS = (
    "primitive",
    "primitives",
    "design-system",
    "ui/base",
    "components/base",
)

HEX_RE = re.compile(r"#[0-9a-fA-F]{3,8}\b")
COLOR_FUNC_RE = re.compile(r"\b(?:oklch|rgb|rgba|hsl|hsla|lab|lch)\(")
ARBITRARY_TW_RE = re.compile(
    r"\b(?:bg|text|border|ring|fill|stroke|from|via|to|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|space-x|space-y|rounded|shadow|w|h|min-w|min-h|max-w|max-h)-\[[^\]]+\]"
)
INTERACTIVE_RE = re.compile(r"<(button|input|select|textarea|dialog)\b")
METADATA_RE = re.compile(r"\b(generateMetadata|metadata\s*:|export\s+const\s+metadata)\b")
SECURITY_HEADER_RE = re.compile(
    r"(Content-Security-Policy|Strict-Transport-Security|X-Content-Type-Options|"
    r"Referrer-Policy|Permissions-Policy|Cross-Origin-|helmet\(|headers\s*\()",
    re.IGNORECASE,
)
AUTH_RE = re.compile(r"(next-auth|authjs|clerk|supabase|lucia|better-auth|passport|iron-session|jwt|session)", re.IGNORECASE)
ANALYTICS_RE = re.compile(r"(analytics|posthog|plausible|segment|gtag|dataLayer|rudderstack|mixpanel|amplitude)", re.IGNORECASE)
I18N_RE = re.compile(r"(<html[^>]+lang=|next-intl|react-intl|i18next|Intl\.|hreflang|dir=|locale)", re.IGNORECASE)
RELEASE_RE = re.compile(r"(rollback|runbook|SLO|service level|incident|feature flag|environment matrix|release checklist)", re.IGNORECASE)
BACKUP_RE = re.compile(r"(backup|restore|point-in-time|PITR|disaster recovery|rollback)", re.IGNORECASE)
THREAT_RE = re.compile(r"(threat model|OWASP|ASVS|secure header|CSP|Content-Security-Policy|CSRF|SSRF)", re.IGNORECASE)
PRIVACY_RE = re.compile(r"(data map|data retention|processor|consent|opt-out|delete account|data export|privacy)", re.IGNORECASE)
CLAIMS_RE = re.compile(r"(claims ledger|claim review|pricing truth|support path|security contact|status page|changelog)", re.IGNORECASE)
SUSTAINABILITY_RE = re.compile(r"(sustainability|payload budget|font budget|low-bandwidth|low data|carbon|green hosting)", re.IGNORECASE)
AI_FEATURE_RE = re.compile(r"(@ai-sdk|openai|anthropic|gemini|vertexai|langchain|llamaindex|ollama|LLM|generative AI)", re.IGNORECASE)
AI_RISK_RE = re.compile(r"(prompt injection|OWASP.*LLM|AI RMF|excessive agency|model provider|output validation)", re.IGNORECASE)
HARDCODED_SECRET_RE = re.compile(
    r"(?i)(api[_-]?key|secret|token|password|private[_-]?key)\s*[:=]\s*['\"][^'\"\s]{16,}['\"]"
)


@dataclass
class Finding:
    severity: str
    category: str
    path: str
    line: int
    message: str


def iter_files(root: Path) -> Iterable[Path]:
    for path in root.rglob("*"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.is_file():
            yield path


def rel(path: Path, root: Path) -> str:
    try:
        return str(path.relative_to(root))
    except ValueError:
        return str(path)


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""


def is_token_file(path: Path) -> bool:
    haystack = str(path).lower()
    return any(hint in haystack for hint in TOKEN_PATH_HINTS)


def is_prod_file(path: Path, root: Path) -> bool:
    if path.suffix not in PROD_EXTS:
        return False
    relative = rel(path, root)
    return any(relative.startswith(hint + "/") or ("/" + hint + "/") in relative for hint in PROD_PATH_HINTS)


def is_primitive_file(path: Path) -> bool:
    haystack = str(path).lower()
    return any(hint in haystack for hint in PRIMITIVE_PATH_HINTS)


def line_number(text: str, index: int) -> int:
    return text.count("\n", 0, index) + 1


def scan_literals(root: Path, findings: list[Finding]) -> None:
    for path in iter_files(root):
        if not is_prod_file(path, root) or is_token_file(path):
            continue
        text = read_text(path)
        relative = rel(path, root)
        for regex, category, message in [
            (HEX_RE, "raw-color", "Raw hex color literal outside token source."),
            (COLOR_FUNC_RE, "raw-color", "Raw color function outside token source."),
            (ARBITRARY_TW_RE, "arbitrary-tailwind", "Arbitrary Tailwind value in production code."),
        ]:
            for match in regex.finditer(text):
                findings.append(Finding("error", category, relative, line_number(text, match.start()), message))


def scan_interactive_html(root: Path, findings: list[Finding]) -> None:
    for path in iter_files(root):
        if path.suffix not in COMPONENT_EXTS or not is_prod_file(path, root) or is_primitive_file(path):
            continue
        text = read_text(path)
        relative = rel(path, root)
        for match in INTERACTIVE_RE.finditer(text):
            findings.append(
                Finding(
                    "warning",
                    "primitive-bypass",
                    relative,
                    line_number(text, match.start()),
                    "Interactive native element outside primitive layer; verify it composes from the design system.",
                )
            )


def scan_hardcoded_secrets(root: Path, findings: list[Finding]) -> None:
    for path in iter_files(root):
        if not is_prod_file(path, root) or is_token_file(path):
            continue
        text = read_text(path)
        relative = rel(path, root)
        for match in HARDCODED_SECRET_RE.finditer(text):
            findings.append(
                Finding(
                    "error",
                    "security",
                    relative,
                    line_number(text, match.start()),
                    "Potential hardcoded secret in production code.",
                )
            )


def has_package(root: Path, package_names: tuple[str, ...]) -> bool:
    pkg = root / "package.json"
    if not pkg.exists():
        return False
    text = read_text(pkg)
    return any(name in text for name in package_names)


def any_path(root: Path, patterns: tuple[str, ...]) -> bool:
    paths = [rel(p, root) for p in iter_files(root)]
    return any(any(re.search(pattern, p) for p in paths) for pattern in patterns)


def any_text(root: Path, regex: re.Pattern[str]) -> bool:
    for path in iter_files(root):
        if path.suffix in PROD_EXTS or path.name in {"package.json", "next.config.js", "next.config.ts"}:
            if regex.search(read_text(path)):
                return True
    return False


def any_manifest_text(root: Path, regex: re.Pattern[str]) -> bool:
    for path in iter_files(root):
        if path.suffix in {".md", ".mdx", ".json", ".ts", ".tsx", ".js", ".jsx", ".yml", ".yaml"}:
            if regex.search(read_text(path)):
                return True
    return False


def component_files(root: Path) -> list[Path]:
    result: list[Path] = []
    for path in iter_files(root):
        relative = rel(path, root)
        if path.suffix in COMPONENT_EXTS and (
            "/components/" in "/" + relative or relative.startswith("components/")
        ):
            if ".stories." not in path.name and ".test." not in path.name and ".spec." not in path.name:
                result.append(path)
    return result


def story_files(root: Path) -> set[str]:
    stems: set[str] = set()
    for path in iter_files(root):
        if ".stories." in path.name:
            stems.add(path.name.split(".stories.")[0])
    return stems


def scan_required_surfaces(root: Path, findings: list[Finding]) -> None:
    if not (root / "package.json").exists():
        findings.append(Finding("warning", "project", "package.json", 0, "No package.json found; scanner may be pointed at the wrong root."))
        return

    checks = [
        (
            has_package(root, ("tailwindcss",)),
            "tailwind",
            "package.json",
            "Tailwind dependency not detected.",
        ),
        (
            any_text(root, re.compile(r"(@theme|theme\s*:|--color-|--spacing-|--radius-)")),
            "tokens",
            ".",
            "No obvious design token or Tailwind theme surface detected.",
        ),
        (
            has_package(root, ("@radix-ui/", "@headlessui/react")),
            "primitives",
            "package.json",
            "Radix UI or Headless UI dependency not detected.",
        ),
        (
            any_path(root, (r"(^|/)\.storybook/",)),
            "storybook",
            ".storybook",
            "Storybook configuration not detected.",
        ),
        (
            has_package(root, ("@sentry/",)),
            "observability",
            "package.json",
            "Sentry dependency not detected.",
        ),
        (
            any_path(root, (r"(manifest|site)\.(json|webmanifest|ts)$", r"sw\.(js|ts)$", r"service-worker\.(js|ts)$")),
            "pwa",
            ".",
            "PWA manifest or service worker not detected. If PWA is out of scope, record that in the plan.",
        ),
        (
            any_text(root, METADATA_RE),
            "seo",
            ".",
            "Framework metadata surface not detected.",
        ),
        (
            any_path(root, (r"robots\.(txt|ts)$", r"sitemap\.(xml|ts)$")),
            "seo",
            ".",
            "robots or sitemap surface not detected.",
        ),
        (
            any_text(root, re.compile(r"(dark:|prefers-color-scheme|next-themes|className=.dark|data-theme)")),
            "dark-mode",
            ".",
            "Dark mode surface not detected.",
        ),
        (
            has_package(root, ("framer-motion", "motion")),
            "motion",
            "package.json",
            "Motion or Framer Motion dependency not detected. If motion is intentionally absent, record that in the plan.",
        ),
        (
            any_path(root, (r"(WEB-APP-PLAN|web-app-plan|implementation-plan|CURRENT-WORK)\.md$",)),
            "plan",
            ".",
            "On-disk web app plan not detected.",
        ),
        (
            any_manifest_text(root, SECURITY_HEADER_RE),
            "security",
            ".",
            "Security-header configuration not detected. If handled by hosting, record evidence in the plan.",
        ),
        (
            any_manifest_text(root, THREAT_RE),
            "security",
            ".",
            "Threat model or security review evidence not detected.",
        ),
        (
            any_manifest_text(root, PRIVACY_RE),
            "privacy",
            ".",
            "Privacy data map, consent, deletion/export, or retention evidence not detected.",
        ),
        (
            any_manifest_text(root, AUTH_RE),
            "auth",
            ".",
            "Auth/session surface not detected. If the app is public-only, record that in the plan.",
        ),
        (
            any_manifest_text(root, ANALYTICS_RE),
            "analytics",
            ".",
            "Analytics taxonomy or implementation not detected. If analytics is out of scope, record that in the plan.",
        ),
        (
            any_manifest_text(root, RELEASE_RE),
            "release",
            ".",
            "Release, rollback, runbook, SLO, or incident evidence not detected.",
        ),
        (
            any_manifest_text(root, BACKUP_RE),
            "reliability",
            ".",
            "Backup, restore, rollback, or data-recovery evidence not detected.",
        ),
        (
            any_manifest_text(root, I18N_RE),
            "i18n",
            ".",
            "Language, locale, hreflang, direction, or i18n surface not detected.",
        ),
        (
            any_manifest_text(root, SUSTAINABILITY_RE),
            "sustainability",
            ".",
            "Sustainability, payload budget, low-bandwidth, or resource-footprint evidence not detected.",
        ),
        (
            any_manifest_text(root, CLAIMS_RE),
            "governance",
            ".",
            "Claims ledger, support path, changelog, security contact, or product-truth evidence not detected.",
        ),
    ]

    for ok, category, path, message in checks:
        if not ok:
            findings.append(Finding("warning", category, path, 0, message))

    if any_manifest_text(root, AI_FEATURE_RE) and not any_manifest_text(root, AI_RISK_RE):
        findings.append(
            Finding(
                "warning",
                "ai-risk",
                ".",
                0,
                "AI feature surface detected without AI-risk register evidence.",
            )
        )


def scan_story_coverage(root: Path, findings: list[Finding]) -> None:
    stories = story_files(root)
    for component in component_files(root):
        if is_primitive_file(component):
            continue
        stem = component.stem
        if stem not in stories:
            findings.append(
                Finding(
                    "warning",
                    "storybook",
                    rel(component, root),
                    0,
                    "Component has no matching Storybook story by filename stem.",
                )
            )


def scan_content(root: Path, findings: list[Finding]) -> None:
    text_paths = [rel(p, root).lower() for p in iter_files(root)]
    required = {
        "terms": any("terms" in p for p in text_paths),
        "privacy": any("privacy" in p for p in text_paths),
        "blog": any("/blog" in p or p.startswith("blog/") for p in text_paths),
        "favicon": any("favicon" in p or "icon." in p or "apple-icon" in p for p in text_paths),
        "og-image": any("og" in p and ("png" in p or "jpg" in p or "tsx" in p or "ts" in p) for p in text_paths),
    }
    for key, ok in required.items():
        if not ok:
            findings.append(Finding("warning", "content", ".", 0, f"{key} surface not detected. If out of scope, record that in the plan."))

    trust_required = {
        "support/contact": any("support" in p or "contact" in p for p in text_paths),
        "security/trust": any("security" in p or "trust" in p for p in text_paths),
        "status/changelog": any("status" in p or "changelog" in p or "release" in p for p in text_paths),
    }
    for key, ok in trust_required.items():
        if not ok:
            findings.append(Finding("warning", "trust", ".", 0, f"{key} surface not detected. If out of scope, record that in the plan."))

    placeholder_re = re.compile(r"(lorem ipsum|TODO|Coming soon|Acme|Jane Doe|John Doe|fake quote)", re.IGNORECASE)
    for path in iter_files(root):
        if path.suffix in {".md", ".mdx", ".tsx", ".jsx"} and is_prod_file(path, root):
            text = read_text(path)
            match = placeholder_re.search(text)
            if match:
                findings.append(
                    Finding(
                        "warning",
                        "content",
                        rel(path, root),
                        line_number(text, match.start()),
                        "Placeholder or fake content marker detected.",
                    )
                )


def audit(root: Path) -> list[Finding]:
    findings: list[Finding] = []
    scan_required_surfaces(root, findings)
    scan_literals(root, findings)
    scan_hardcoded_secrets(root, findings)
    scan_interactive_html(root, findings)
    scan_story_coverage(root, findings)
    scan_content(root, findings)
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit web app contract drift.")
    parser.add_argument("root", nargs="?", default=".", help="Target app root")
    parser.add_argument("--json", action="store_true", help="Emit JSON")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    findings = audit(root)
    errors = [f for f in findings if f.severity == "error"]
    warnings = [f for f in findings if f.severity == "warning"]

    if args.json:
        print(json.dumps({"root": str(root), "errors": len(errors), "warnings": len(warnings), "findings": [asdict(f) for f in findings]}, indent=2))
    else:
        print(f"Audit root: {root}")
        print(f"Errors: {len(errors)}")
        print(f"Warnings: {len(warnings)}")
        for finding in findings:
            loc = finding.path if finding.line == 0 else f"{finding.path}:{finding.line}"
            print(f"{finding.severity.upper()} [{finding.category}] {loc}: {finding.message}")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Validate local article links, assets, frontmatter, and TOC coverage."""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote


# The root is derived from this checked-in script, not user input.
ROOT = Path(__file__).resolve().parents[4]
HELP = ROOT / "help"
TOC = HELP / "main-toc" / "TOC.md"
ASSETS = HELP / "assets"

LINK_RE = re.compile(r"(!?)\[[^\]]*]\(([^)]+)\)")
FRONTMATTER_RE = re.compile(r"\A---\n(?P<body>.*?)\n---\n", re.DOTALL)


def within_root(path: Path) -> Path | None:
    """Resolve a documentation path and reject paths outside the repository."""
    resolved = path.resolve()
    try:
        resolved.relative_to(ROOT)
    except ValueError:
        return None
    return resolved


def local_target(source: Path, raw_target: str) -> Path | None:
    """Return the safe local target path, or None for non-file links."""
    target = raw_target.strip().split("#", 1)[0].strip()
    if not target or target.startswith(("https://", "http://", "mailto:", "tel:")):
        return None

    decoded = unquote(target)
    candidate = ROOT / decoded.lstrip("/") if decoded.startswith("/") else source.parent / decoded
    return within_root(candidate)


def validate_frontmatter(article: Path, text: str, errors: list[str]) -> None:
    match = FRONTMATTER_RE.match(text)
    if not match:
        errors.append(f"{article.relative_to(ROOT)}: missing YAML frontmatter")
        return

    body = match.group("body")
    fields = (
        ("user-guide-title", "user-guide-description")
        if article == TOC
        else ("title", "description")
    )
    for field in fields:
        if not re.search(rf"^{field}:\s*\S", body, re.MULTILINE):
            errors.append(f"{article.relative_to(ROOT)}: missing frontmatter field '{field}'")


def validate_links(
    article: Path,
    text: str,
    errors: list[str],
    image_targets: set[Path],
) -> None:
    for image_marker, raw_target in LINK_RE.findall(text):
        target = local_target(article, raw_target)
        if target is None:
            continue

        if image_marker:
            image_targets.add(target)

        if not target.exists():
            kind = "image" if image_marker else "link"
            errors.append(
                f"{article.relative_to(ROOT)}: missing {kind} target '{raw_target}'"
            )


def validate_toc(articles: list[Path], errors: list[str]) -> None:
    toc_text = TOC.read_text(encoding="utf-8")
    for article in articles:
        if article == TOC:
            continue
        expected = f"/{article.relative_to(ROOT).as_posix()}"
        if expected not in toc_text:
            errors.append(f"{article.relative_to(ROOT)}: article is not linked from the TOC")


def validate_assets(image_targets: set[Path], errors: list[str]) -> None:
    """Reject unreferenced public image files that increase leak surface."""
    image_suffixes = {".jpeg", ".jpg", ".png", ".webp"}
    for asset in sorted(ASSETS.rglob("*")):
        if asset.is_file() and asset.suffix.lower() in image_suffixes:
            if asset.resolve() not in image_targets:
                errors.append(f"{asset.relative_to(ROOT)}: image is not referenced by an article")


def validate_capture_ignore(errors: list[str]) -> None:
    """Ensure raw screenshot capture packs cannot be added accidentally."""
    gitignore = ROOT / ".gitignore"
    if not gitignore.is_file():
        errors.append(".gitignore: missing raw capture protection")
        return

    ignored = {
        line.strip()
        for line in gitignore.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    }
    if "docs-captures/" not in ignored:
        errors.append(".gitignore: docs-captures/ must remain ignored")


def main() -> int:
    if not HELP.is_dir() or not TOC.is_file():
        print("Documentation root could not be resolved safely.", file=sys.stderr)
        return 2

    articles = sorted(HELP.rglob("*.md"))
    errors: list[str] = []
    image_targets: set[Path] = set()

    for article in articles:
        text = article.read_text(encoding="utf-8")
        validate_frontmatter(article, text, errors)
        validate_links(article, text, errors, image_targets)

    validate_toc(articles, errors)
    validate_assets(image_targets, errors)
    validate_capture_ignore(errors)

    if errors:
        print("Documentation validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Documentation validation passed for {len(articles)} articles.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

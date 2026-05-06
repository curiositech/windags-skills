#!/usr/bin/env python3
"""
Generate an image with Google's Nano Banana models, using a character reference
and a style-template reference with explicit role labels in the prompt.

Implements the documented patterns:
  - aspect ratio in image_config (NOT in the prompt)
  - role-labeled multi-reference prompt: [Refs] + [Relationship] + [Scenario]
  - positive framing for text suppression
  - automatic fallback from gemini-3-pro-image-preview to gemini-2.5-flash-image

Usage:
    GEMINI_API_KEY=... python3 generate.py \
        --char path/to/character-sheet.png \
        --style path/to/style-template.webp \
        --scene "He sits at a cluttered desk late at night..." \
        --out path/to/output.png \
        --aspect 16:9

    # No style reference (character only):
    python3 generate.py --char alex.png --scene "..." --out hero.png

    # No references (text-only generation):
    python3 generate.py --scene "A pixel-art cat" --out cat.png --aspect 1:1

Dependencies: stdlib only. No google-genai SDK required.
"""
from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
DEFAULT_MODEL = "gemini-3-pro-image-preview"
FALLBACK_MODEL = "gemini-2.5-flash-image"

VALID_ASPECTS = {
    "1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9",
    "1:4", "4:1", "1:8", "8:1",  # only on gemini-3.1-flash-image-preview
}


def encode_image(path: Path) -> dict:
    mime = mimetypes.guess_type(path.name)[0] or "image/png"
    return {
        "inlineData": {
            "mimeType": mime,
            "data": base64.b64encode(path.read_bytes()).decode(),
        }
    }


def build_role_labeled_prompt(
    scene: str,
    has_char: bool,
    has_style: bool,
    aspect: str,
    suppress_text: bool,
) -> str:
    parts: list[str] = []

    if has_char and has_style:
        parts.append(
            "Reference image 1 is the CHARACTER SHEET — preserve the subject's "
            "face, build, hair, and clothing exactly as shown."
        )
        parts.append(
            "Reference image 2 is the STYLE TEMPLATE — match its rendering "
            "technique, color palette, lighting, and overall composition."
        )
    elif has_char:
        parts.append(
            "Reference image 1 is the CHARACTER SHEET — preserve the subject's "
            "face, build, hair, and clothing exactly as shown."
        )
    elif has_style:
        parts.append(
            "Reference image 1 is the STYLE TEMPLATE — match its rendering "
            "technique, color palette, lighting, and overall composition."
        )

    parts.append(f"Generate a new scene where: {scene.strip()}")

    if aspect in {"16:9", "21:9"}:
        parts.append(
            "Wide cinematic framing with the main subject placed off-center; "
            "the composition should breathe horizontally."
        )
    elif aspect in {"9:16", "3:4", "2:3"}:
        parts.append(
            "Tall vertical framing; the composition should breathe vertically."
        )

    if suppress_text:
        parts.append(
            "Any screens, signs, or surfaces in the scene display abstract "
            "shapes and indistinct soft-blurred forms with no readable "
            "typography, no captions, no labels, no watermarks."
        )

    return "\n\n".join(parts)


def call_gemini(
    *,
    api_key: str,
    model: str,
    prompt: str,
    refs: list[Path],
    aspect: str,
    timeout: int = 240,
) -> bytes:
    parts: list[dict] = [encode_image(p) for p in refs]
    parts.append({"text": prompt})

    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": aspect},
        },
    }

    req = urllib.request.Request(
        ENDPOINT.format(model=model),
        data=json.dumps(body).encode(),
        headers={
            "x-goog-api-key": api_key,
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read().decode())

    candidate = data.get("candidates", [{}])[0]
    finish_reason = candidate.get("finishReason")
    response_parts = candidate.get("content", {}).get("parts", [])
    for p in response_parts:
        inline = p.get("inlineData") or p.get("inline_data")
        if inline and inline.get("data"):
            return base64.b64decode(inline["data"])
        if "text" in p:
            sys.stderr.write(f"[model-text] {p['text'][:300]}\n")

    raise RuntimeError(
        f"No image in response. finishReason={finish_reason}. "
        f"Raw keys: {[list(p.keys()) for p in response_parts]}"
    )


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--scene", required=True, help="Scene description (the [New scenario] piece of the prompt formula)")
    ap.add_argument("--out", required=True, type=Path, help="Output PNG path")
    ap.add_argument("--char", type=Path, help="Character-reference image (role labeled as CHARACTER SHEET)")
    ap.add_argument("--style", type=Path, help="Style-reference image (role labeled as STYLE TEMPLATE)")
    ap.add_argument("--aspect", default="16:9", help=f"Aspect ratio. Supported: {sorted(VALID_ASPECTS)}")
    ap.add_argument("--model", default=DEFAULT_MODEL, help=f"Model id (default: {DEFAULT_MODEL})")
    ap.add_argument("--no-fallback", action="store_true", help="Disable fallback to 2.5-flash-image on Pro failure")
    ap.add_argument("--keep-text", action="store_true", help="Don't add the text-suppression clause")
    args = ap.parse_args()

    if args.aspect not in VALID_ASPECTS:
        sys.exit(f"Unsupported aspect ratio: {args.aspect}. Supported: {sorted(VALID_ASPECTS)}")

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        sys.exit("GEMINI_API_KEY not set. Get a key at https://aistudio.google.com/app/apikey")

    refs: list[Path] = []
    for p in (args.char, args.style):
        if p is None:
            continue
        if not p.exists():
            sys.exit(f"Reference image not found: {p}")
        refs.append(p)

    prompt = build_role_labeled_prompt(
        scene=args.scene,
        has_char=args.char is not None,
        has_style=args.style is not None,
        aspect=args.aspect,
        suppress_text=not args.keep_text,
    )
    sys.stderr.write(f"[prompt]\n{prompt}\n\n")

    args.out.parent.mkdir(parents=True, exist_ok=True)

    models_to_try = [args.model]
    if not args.no_fallback and args.model != FALLBACK_MODEL:
        models_to_try.append(FALLBACK_MODEL)

    last_err: Exception | None = None
    for model in models_to_try:
        try:
            sys.stderr.write(f"[call] model={model} aspect={args.aspect} refs={len(refs)}\n")
            img = call_gemini(api_key=api_key, model=model, prompt=prompt, refs=refs, aspect=args.aspect)
            args.out.write_bytes(img)
            sys.stderr.write(f"[ok] wrote {args.out} ({args.out.stat().st_size // 1024}KB) via {model}\n")
            return 0
        except urllib.error.HTTPError as e:
            body = e.read().decode() if e.fp else "no body"
            sys.stderr.write(f"[http {e.code}] {body[:600]}\n")
            last_err = e
        except Exception as e:
            sys.stderr.write(f"[err] {e}\n")
            last_err = e

    sys.exit(f"All models failed. Last error: {last_err}")


if __name__ == "__main__":
    sys.exit(main())

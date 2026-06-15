#!/usr/bin/env python3
"""
Generate deterministic, brand-consistent SVG avatars for each agent.
Each agent gets a unique abstract icon derived from its name via a seeded hash.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AGENTS_DIR = ROOT / "content" / "agents"
OUTPUT_DIR = ROOT / "public" / "images" / "agents"

# Brand palette: cyan, amber, violet, rose, emerald, sky, fuchsia, teal, lime, indigo
PALETTE = [
    ("#22d3ee", "#0891b2"),
    ("#f5a623", "#d97706"),
    ("#a78bfa", "#7c3aed"),
    ("#fb7185", "#e11d48"),
    ("#34d399", "#059669"),
    ("#60a5fa", "#2563eb"),
    ("#f472b6", "#db2777"),
    ("#2dd4bf", "#0d9488"),
    ("#a3e635", "#65a30d"),
    ("#818cf8", "#4f46e5"),
]


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def seeded_hash(text: str) -> int:
    h = 0
    for ch in text:
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    return h


def shape_for(seed: int, index: int) -> str:
    shapes = [
        # concentric circles
        lambda: f'<circle cx="64" cy="64" r="40" fill="{c1}" opacity="0.25"/><circle cx="64" cy="64" r="26" fill="{c1}" opacity="0.5"/><circle cx="64" cy="64" r="12" fill="{c2}"/>',
        # nested rounded squares
        lambda: f'<rect x="24" y="24" width="80" height="80" rx="18" fill="{c1}" opacity="0.25"/><rect x="38" y="38" width="52" height="52" rx="12" fill="{c1}" opacity="0.5"/><rect x="50" y="50" width="28" height="28" rx="8" fill="{c2}"/>',
        # diamond / rotated square
        lambda: f'<polygon points="64,20 108,64 64,108 20,64" fill="{c1}" opacity="0.25"/><polygon points="64,40 88,64 64,88 40,64" fill="{c1}" opacity="0.55"/><circle cx="64" cy="64" r="10" fill="{c2}"/>',
        # hexagon
        lambda: f'<polygon points="64,18 103,45 103,83 64,110 25,83 25,45" fill="{c1}" opacity="0.25"/><polygon points="64,38 86,54 86,74 64,90 42,74 42,54" fill="{c1}" opacity="0.5"/><circle cx="64" cy="64" r="9" fill="{c2}"/>',
        # cross / plus
        lambda: f'<rect x="22" y="52" width="84" height="24" rx="8" fill="{c1}" opacity="0.35"/><rect x="52" y="22" width="24" height="84" rx="8" fill="{c1}" opacity="0.35"/><circle cx="64" cy="64" r="12" fill="{c2}"/>',
        # orbiting dots
        lambda: f'<circle cx="64" cy="64" r="34" fill="none" stroke="{c1}" stroke-width="4" opacity="0.4"/><circle cx="64" cy="30" r="8" fill="{c2}"/><circle cx="90" cy="78" r="7" fill="{c1}"/><circle cx="38" cy="78" r="7" fill="{c1}"/>',
        # chevron / arrow motif
        lambda: f'<polygon points="64,20 108,64 64,64 64,108 20,64 64,64" fill="{c1}" opacity="0.25"/><polygon points="64,44 84,64 64,84 44,64" fill="{c2}"/>',
        # grid node
        lambda: f'<rect x="20" y="20" width="88" height="88" rx="14" fill="{c1}" opacity="0.18"/><circle cx="40" cy="40" r="6" fill="{c2}"/><circle cx="88" cy="40" r="6" fill="{c2}"/><circle cx="40" cy="88" r="6" fill="{c2}"/><circle cx="88" cy="88" r="6" fill="{c2}"/><circle cx="64" cy="64" r="9" fill="{c1}"/><path d="M40 40 L64 64 M88 40 L64 64 M40 88 L64 64 M88 88 L64 64" stroke="{c1}" stroke-width="2" opacity="0.5"/>',
        # sound / pulse rings
        lambda: f'<circle cx="64" cy="64" r="46" fill="none" stroke="{c1}" stroke-width="3" opacity="0.25"/><circle cx="64" cy="64" r="32" fill="none" stroke="{c1}" stroke-width="4" opacity="0.45"/><circle cx="64" cy="64" r="18" fill="{c2}"/>',
        # shield / badge
        lambda: f'<path d="M64 18 L104 38 V70 Q104 94 64 110 Q24 94 24 70 V38 Z" fill="{c1}" opacity="0.25"/><path d="M64 36 L88 50 V70 Q88 86 64 98 Q40 86 40 70 V50 Z" fill="{c2}" opacity="0.7"/><circle cx="64" cy="66" r="8" fill="{c1}"/>',
    ]
    return shapes[seed % len(shapes)]()


def generate_avatar(name: str) -> str:
    seed = seeded_hash(name)
    palette_index = seed % len(PALETTE)
    global c1, c2
    c1, c2 = PALETTE[palette_index]
    shape = shape_for(seed, 0)
    initials = "".join(w[0] for w in re.sub(r"[^A-Za-z]", " ", name).split() if w)[:2].upper()

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="g" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
  </defs>
  <rect width="128" height="128" rx="24" fill="url(#g)" />
  {shape}
  <text x="64" y="122" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" fill="#e2e8f0" letter-spacing="0.5">{initials}</text>
</svg>
'''
    return svg


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    files = sorted(AGENTS_DIR.glob("*.md"))
    for path in files:
        name = path.stem
        svg = generate_avatar(name)
        out = OUTPUT_DIR / f"{name}.svg"
        out.write_text(svg)
        print(f"Wrote {out}")
    print(f"\nGenerated {len(files)} avatars in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

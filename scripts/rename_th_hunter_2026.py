#!/usr/bin/env python3
"""Convert locally saved 2026 TH/STH JPG images to case-labelled WebP files.

Run from anywhere:
    python rename_th_hunter_2026.py --source /path/to/Treasures

Original JPGs are preserved. Output defaults to <source>/optimized/{TH,STH}.
Case assignments are those in the agreed naming list; verify against your catalog.
"""
from __future__ import annotations

import argparse
from pathlib import Path
from PIL import Image, ImageOps

# Existing filename -> (case, car slug)
MAPPING = {
    "TH": {
        "2026-TH-87-Buick-Regal-GNX-1.jpg": ("a", "87-buick-regal-gnx"),
        "26-TH-92-Dodge-Viper-RT10-1.jpg": ("b", "92-dodge-viper-rt10"),
        "26-TH-Electro-Silhouette-1.jpg": ("c", "electro-silhouette"),
        "2026-TH-Hot-Wheengs-1.jpg": ("d", "hot-wheengs"),
        "2026-TH-Cone-Shaker-1.jpg": ("e", "cone-shaker"),
        "2026-TH-2016-Ford-GT-Race-1.jpg": ("f", "2016-ford-gt-race"),
        "2026-TH-2-Jet-Z-Int-Card-1.jpg": ("g", "2-jet-z"),
        "2026-TH-Total-Disposal-1.jpg": ("h", "total-disposal"),
        "2026-TH-Amaru-GTC-1.jpg": ("j", "amaru-gtc"),
        "26-TH-Sweet-Driver-1.jpg": ("k", "sweet-driver"),
        "26-TH-Mad-Manga-01.jpg": ("l", "mad-manga"),
        "2026-TH-Ford-Model-A-Custom-31-0.jpg": ("m", "ford-model-a-custom-31"),
        "2026-TH-Fast-Fish-1.jpg": ("n", "fast-fish"),
        "26-TH-Nissan-Skyline-HT-2000GT-X-1.jpg": ("p", "nissan-skyline-ht-2000gt-x"),
        "26-TH-Gazella-GT-1.jpg": ("q", "gazella-gt"),
    },
    "STH": {
        "2026-STH-Drift-Ender-US-Card.jpg": ("a", "drift-ender"),
        "2026-STH-Ford-Mustang-GTD-Int-Card.jpg": ("b", "ford-mustang-gtd"),
        "2026-STH-Ferrari-F40-Competizione-US-Card.jpg": ("c", "ferrari-f40-competizione"),
        "2026-STH-64-Impala-Int-Card.jpg": ("d", "64-impala"),
        "2026-STH-87-Ford-Sierra-Cosworth-Int-Card.jpg": ("e", "87-ford-sierra-cosworth"),
        "2026-STH-Honda-Civic-Custom-US-Card.jpg": ("f", "honda-civic-custom"),
        "2026-STH-Custom-Otto-US-Card.jpg": ("g", "custom-otto"),
        "2026-STH-Lotus-Sport-Elise-Int-Card.jpg": ("h", "lotus-sport-elise"),
        "2026-STH-Subaru-Impreza-Int-Card.jpg": ("j", "subaru-impreza"),
        "2026-STH-94-Toyota-Supra-Int-Card.jpg": ("k", "94-toyota-supra"),
        "2026-STH-Nissan-Maxima-Drift-Car-US-Card.jpg": ("l", "nissan-maxima-drift-car"),
        "2026-STH-Porsche-911-Carrera-RS-27-US-Card.jpg": ("m", "porsche-911-carrera-rs-27"),
        "2026-STH-23-Ram-1500-Int-Card.jpg": ("n", "23-ram-1500"),
        "2026-STH-70-Plymouth-AAR-Cuda-US-Card.jpg": ("p", "70-plymouth-aar-cuda"),
        "2026-STH-67-Pontiac-Firebird-400-US-Card.jpg": ("q", "67-pontiac-firebird-400"),
    },
}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=Path.cwd(), help="Folder containing TH/ and STH/ (default: current directory)")
    parser.add_argument("--output", type=Path, help="Where converted images go (default: SOURCE/optimized)")
    parser.add_argument("--max-size", type=int, default=800, help="Longest image dimension (default: 800)")
    parser.add_argument("--quality", type=int, default=82, help="WebP quality 1-100 (default: 82)")
    parser.add_argument("--dry-run", action="store_true", help="Print mapping without writing images")
    parser.add_argument("--overwrite", action="store_true", help="Replace existing output WebP files")
    args = parser.parse_args()
    source = args.source.expanduser().resolve()
    output = (args.output.expanduser().resolve() if args.output else source / "optimized")

    converted = skipped = missing = 0
    for kind, files in MAPPING.items():
        source_dir, output_dir = source / kind, output / kind
        if not source_dir.is_dir():
            print(f"ERROR: Missing folder: {source_dir}")
            return 1
        if not args.dry_run:
            output_dir.mkdir(parents=True, exist_ok=True)
        for old_name, (case, slug) in files.items():
            input_path = source_dir / old_name
            new_name = f"2026-{kind.lower()}-{case}-{slug}.webp"
            target = output_dir / new_name
            if not input_path.is_file():
                print(f"MISSING: {input_path}")
                missing += 1
                continue
            if args.dry_run:
                print(f"{kind}/{old_name}  ->  optimized/{kind}/{new_name}")
                continue
            if target.exists() and not args.overwrite:
                print(f"SKIP existing: {target}")
                skipped += 1
                continue
            try:
                with Image.open(input_path) as im:
                    im = ImageOps.exif_transpose(im)
                    if im.mode not in ("RGB", "RGBA"):
                        im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
                    if args.max_size > 0:
                        im.thumbnail((args.max_size, args.max_size), Image.Resampling.LANCZOS)
                    im.save(target, "WEBP", quality=args.quality, method=6)
                print(f"OK: {target.relative_to(output)}")
                converted += 1
            except Exception as exc:
                print(f"ERROR: {input_path}: {exc}")
                missing += 1
    if args.dry_run:
        print("Dry run complete. No files were changed.")
    else:
        print(f"Done: {converted} converted, {skipped} already existing, {missing} missing/failed. Originals unchanged.")
    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())

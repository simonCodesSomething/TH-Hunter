#!/usr/bin/env python3
"""Rename and optimize TH Hunter 2026 TH/STH loose & carded photos by SKU order.

INPUT:
 Treasures/TH/loose/<SKU>_1_1.webp
 Treasures/TH/carded/<SKU>_1_2.webp
 Treasures/STH/loose/<SKU>_1_1.webp
 Treasures/STH/carded/<SKU>_1_2.webp

Assumption supplied by the collector: sorting SKUs in ascending order gives
case order A, B, C, D, E, F, G, H, J, K, L, M, N, P, Q (no I or O).
The script cannot independently establish case from SKU. Always --dry-run
and verify the mappings before processing.

Outputs to optimized/<TH|STH>/<loose|carded>/YEAR-type-case-name.webp.
Originals are unchanged. Outputs will not be overwritten.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from PIL import Image, ImageOps

YEAR = 2026
CASES = tuple("ABCDEFGHJKLMNPQ")
CARS = {
    "TH": (
        "87-buick-regal-gnx",
        "92-dodge-viper-rt10",
        "electro-silhouette",
        "hot-wheengs",
        "cone-shaker",
        "2016-ford-gt-race",
        "2-jet-z",
        "total-disposal",
        "amaru-gtc",
        "sweet-driver",
        "mad-manga",
        "ford-model-a-custom-31",
        "fast-fish",
        "nissan-skyline-ht-2000gt-x",
        "gazella-gt",
    ),
    "STH": (
        "drift-ender",
        "ford-mustang-gtd",
        "ferrari-f40-competizione",
        "64-impala",
        "87-ford-sierra-cosworth",
        "honda-civic-custom",
        "custom-otto",
        "lotus-sport-elise",
        "subaru-impreza",
        "94-toyota-supra",
        "nissan-maxima-drift-car",
        "porsche-911-carrera-rs-27",
        "23-ram-1500",
        "70-plymouth-aar-cuda",
        "67-pontiac-firebird-400",
    ),
}
# Permit whitespace either side of underscore as seen in user example.
FILENAME_RE = re.compile(r"^\s*(?P<sku>[A-Za-z0-9][A-Za-z0-9-]*)\s*_\s*1\s*_\s*(?P<variant>[12])\s*\.webp$", re.I)


def natural_key(s: str):
    return [int(x) if x.isdigit() else x.casefold() for x in re.split(r"(\d+)", s)]


def scan_folder(folder: Path, expected_variant: str) -> dict[str, Path]:
    if not folder.is_dir():
        raise ValueError(f"Missing folder: {folder}")
    result = {}
    for path in folder.iterdir():
        if not path.is_file() or path.name.startswith("."):
            continue
        match = FILENAME_RE.fullmatch(path.name)
        if not match:
            raise ValueError(f"Unexpected filename in {folder}: {path.name!r}. Expected <SKU>_1_{expected_variant}.webp")
        if match.group("variant") != expected_variant:
            raise ValueError(f"Wrong photo variant in {folder}: {path.name}")
        sku = match.group("sku").upper()
        if sku in result:
            raise ValueError(f"Duplicate SKU {sku} in {folder}")
        result[sku] = path
    if len(result) != len(CASES):
        raise ValueError(f"{folder}: found {len(result)} photos; expected {len(CASES)} (one per case).")
    return result


def build_plan(input_root: Path, output_root: Path, types: list[str]):
    plan = []
    for car_type in types:
        loose = scan_folder(input_root / car_type / "loose", "1")
        carded = scan_folder(input_root / car_type / "carded", "2")
        if loose.keys() != carded.keys():
            missing_carded = sorted(loose.keys() - carded.keys(), key=natural_key)
            missing_loose = sorted(carded.keys() - loose.keys(), key=natural_key)
            raise ValueError(
                f"{car_type}: loose/carded SKU mismatch. Missing carded: {missing_carded}; missing loose: {missing_loose}"
            )
        for case, sku, car_name in zip(CASES, sorted(loose, key=natural_key), CARS[car_type]):
            filename = f"{YEAR}-{car_type.lower()}-{case.lower()}-{car_name}.webp"
            for variant, sources in (("loose", loose), ("carded", carded)):
                plan.append((car_type, case, sku, variant, sources[sku], output_root / car_type / variant / filename))
    return plan


def write_image(source: Path, destination: Path, max_width: int, quality: int):
    # Destination is reserved exclusively: no silent overwrite (even during races).
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA" if "A" in image.getbands() or "transparency" in image.info else "RGB")
        if image.width > max_width:
            new_height = round(image.height * (max_width / image.width))
            image = image.resize((max_width, new_height), Image.Resampling.LANCZOS)
        # Encode in memory first so an invalid image can't leave a partial output.
        from io import BytesIO
        buffer = BytesIO()
        image.save(buffer, format="WEBP", quality=quality, method=6)
        with destination.open("xb") as out:
            out.write(buffer.getvalue())


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--type", choices=("TH", "STH", "both"), default="both", help="Select which types to process (default: both).")
    parser.add_argument("--input", type=Path, default=Path("Treasures"), help="Input root directory (default: Treasures)")
    parser.add_argument("--output", type=Path, default=Path("optimized"), help="Output root directory (default: optimized)")
    parser.add_argument("--dry-run", action="store_true", help="Preview matches without creating files")
    parser.add_argument("--max-width", type=int, default=800, help="Maximum output width (default: 800)")
    parser.add_argument("--quality", type=int, default=82, help="WebP quality (default: 82)")
    args = parser.parse_args()
    if args.max_width <= 0 or not 1 <= args.quality <= 100:
        parser.error("--max-width must be positive and --quality must be 1–100")
    types = ["TH", "STH"] if args.type == "both" else [args.type]
    try:
        plan = build_plan(args.input, args.output, types)
        conflicts = [dest for *_, dest in plan if dest.exists()]
        if conflicts and not args.dry_run:
            raise ValueError("Outputs already exist; refusing to overwrite:\n" + "\n".join(str(p) for p in conflicts))
        print("\nIMPORTANT: SKU SORT ORDER MUST MATCH CASE ORDER. CHECK EVERY ROW BEFORE RUNNING WITHOUT --dry-run.\n")
        print(f"{'TYPE':<4} {'CASE':<5} {'SKU':<16} {'VARIANT':<7} SOURCE -> OUTPUT")
        for car_type, case, sku, variant, src, dest in plan:
            print(f"{car_type:<4} {case:<5} {sku:<16} {variant:<7} {src} -> {dest}")
        print(f"\n{len(plan)} images {'to preview' if args.dry_run else 'to save'}. Original files will remain unchanged.")
        if args.dry_run:
            if conflicts:
                print(f"Note: {len(conflicts)} output files already exist. Processing would refuse to overwrite them.")
            return 0
        for *_, src, dest in plan:
            write_image(src, dest, args.max_width, args.quality)
        print("Saved all optimized images successfully.")
        return 0
    except (ValueError, OSError, UnidentifiedImageError) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1


from PIL import UnidentifiedImageError
if __name__ == "__main__":
    raise SystemExit(main())

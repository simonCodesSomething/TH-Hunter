#!/usr/bin/env python3
"""Download one representative image per 2026 TH/STH car from HW Treasure.

Run only when you have permission from the applicable photo rights holder.
Requires: pip install requests beautifulsoup4

Example:
 python download_hwtreasure_2026.py --i-have-permission --output images/hwtreasure_2026

Writes a CSV manifest with source page URL, image URL, and downloaded path.
Respect robots.txt, use modest request rates, and don't redistribute without a license.
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup

BASE = "https://www.hwtreasure.com"
INDEXES = {
    "TH": f"{BASE}/2026-2/",
    "STH": f"{BASE}/2026-super/",
}
UA = "THHunterPersonalPhotoReview/1.0 (respectful, permission-based download)"
TIMEOUT = 25


def slug(s: str) -> str:
    s = s.lower().replace("’", "").replace("'", "")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:85]


def clean_url(url: str, base: str) -> str:
    return urljoin(base, url.split("#", 1)[0])


def allowed_url(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme in ("https", "http") and parsed.hostname in (
        "www.hwtreasure.com", "hwtreasure.com"
    )


def get_soup(session: requests.Session, url: str, delay: float) -> BeautifulSoup:
    time.sleep(delay)
    response = session.get(url, timeout=TIMEOUT)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")


def find_car_pages(soup: BeautifulSoup, index_url: str) -> list[tuple[str, str, str]]:
    """2026 index pages list each car as a linked H2 with '(Mix X)' nearby."""
    entries: list[tuple[str, str, str]] = []
    seen = set()
    index_path = urlparse(index_url).path.rstrip("/") + "/"
    for h in soup.select("h2"):
        link = h.find("a", href=True)
        if link is None:
            continue
        page_url = clean_url(link["href"], index_url)
        path = urlparse(page_url).path
        if not allowed_url(page_url) or not path.startswith(index_path) or path == index_path:
            continue
        if page_url in seen:
            continue
        seen.add(page_url)
        name = link.get_text(" ", strip=True)
        label = h.get_text(" ", strip=True)
        match = re.search(r"\bMix\s+([A-Z])\b", label, flags=re.I)
        mix = match.group(1).upper() if match else "unknown"
        entries.append((name, mix, page_url))
    return entries


def best_image(soup: BeautifulSoup, page_url: str) -> str | None:
    """Prefer prominent image from article; fallback to og:image.

    Image selection must be visually checked: some sites use image CDNs,
    thumbnails, or promotional/social graphics for og:image.
    """
    selectors = (
        "article .wp-block-image img",
        "article .post-thumbnail img",
        "article img",
        ".entry-content .wp-block-image img",
        ".entry-content img",
        "main img",
    )
    for selector in selectors:
        for img in soup.select(selector):
            raw = (img.get("data-full-url") or img.get("data-src")
                   or img.get("data-lazy-src") or img.get("src"))
            if not raw:
                continue
            image_url = clean_url(raw, page_url)
            if not allowed_url(image_url):
                continue
            if any(marker in image_url.lower() for marker in (
                "logo", "avatar", "icon", "placeholder", "spinner", "pixel", "banner"
            )):
                continue
            return image_url
    meta = soup.find("meta", attrs={"property": "og:image"})
    if meta and meta.get("content"):
        image_url = clean_url(str(meta["content"]), page_url)
        if allowed_url(image_url):
            return image_url
    return None


def download(session: requests.Session, image_url: str, dest_without_ext: Path, delay: float) -> Path:
    time.sleep(delay)
    with session.get(image_url, timeout=TIMEOUT, stream=True) as res:
        res.raise_for_status()
        mime = res.headers.get("Content-Type", "").split(";")[0].lower()
        valid = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
        if mime not in valid:
            raise ValueError(f"Not a supported image MIME type: {mime or '<missing>'}")
        path = dest_without_ext.with_suffix(valid[mime])
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("wb") as out:
            size = 0
            for chunk in res.iter_content(chunk_size=64 * 1024):
                if chunk:
                    size += len(chunk)
                    if size > 12 * 1024 * 1024:
                        raise ValueError("Image exceeds 12 MB limit")
                    out.write(chunk)
    return path


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--output", type=Path, default=Path("hwtreasure_2026_photos"))
    p.add_argument("--delay", type=float, default=2.0, help="Seconds between requests (min 1)")
    p.add_argument("--i-have-permission", action="store_true", help="Confirm permission to download/reuse photographs")
    p.add_argument("--list-only", action="store_true", help="List model pages without downloading images")
    args = p.parse_args()
    if not args.list_only and not args.i_have_permission:
        p.error("Only download after receiving permission. Pass --i-have-permission to confirm.")
    delay = max(1.0, args.delay)
    session = requests.Session()
    session.headers.update({"User-Agent": UA, "Accept": "text/html,image/avif,image/webp,image/*;q=0.8,*/*;q=0.5"})

    robots = RobotFileParser()
    robots.set_url(f"{BASE}/robots.txt")
    try:
        robots.read()
    except Exception as exc:
        print(f"Could not verify robots.txt ({exc}). Stop and check site permissions manually.", file=sys.stderr)
        return 1
    if not robots.can_fetch(UA, INDEXES["TH"]) or not robots.can_fetch(UA, INDEXES["STH"]):
        print("The site robots.txt does not permit requesting the index pages. Stopping.", file=sys.stderr)
        return 1

    rows: list[dict[str, str]] = []
    for kind, index_url in INDEXES.items():
        try:
            soup = get_soup(session, index_url, delay)
        except requests.RequestException as exc:
            print(f"Cannot load {index_url}: {exc}", file=sys.stderr)
            continue
        cars = find_car_pages(soup, index_url)
        print(f"{kind}: found {len(cars)} model pages")
        for idx, (name, mix, page_url) in enumerate(cars, 1):
            row = {"type": kind, "year": "2026", "mix": mix, "model": name,
                   "page_url": page_url, "image_url": "", "file": "", "status": ""}
            if not robots.can_fetch(UA, page_url):
                row["status"] = "robots_disallowed"
            elif args.list_only:
                row["status"] = "listed_only"
            else:
                try:
                    car_soup = get_soup(session, page_url, delay)
                    image_url = best_image(car_soup, page_url)
                    if not image_url:
                        row["status"] = "no_image_found"
                    elif not robots.can_fetch(UA, image_url):
                        row["status"] = "image_robots_disallowed"
                    else:
                        row["image_url"] = image_url
                        target = args.output / kind / f"2026-{kind.lower()}-mix-{mix.lower()}-{slug(name)}"
                        saved = download(session, image_url, target, delay)
                        row["file"] = str(saved)
                        row["status"] = "downloaded"
                except (requests.RequestException, ValueError, OSError) as exc:
                    row["status"] = f"error: {str(exc)[:120]}"
            rows.append(row)
            print(f"  [{idx:02d}/{len(cars):02d}] {name} ({mix}) — {row['status']}")
    args.output.mkdir(parents=True, exist_ok=True)
    manifest = args.output / "manifest.csv"
    with manifest.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["type", "year", "mix", "model", "page_url", "image_url", "file", "status"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"\nManifest: {manifest} ({len(rows)} models)")
    print("Review all images for accuracy and check attribution/licensing before any app distribution.")
    return 0 if rows else 1


if __name__ == "__main__":
    raise SystemExit(main())

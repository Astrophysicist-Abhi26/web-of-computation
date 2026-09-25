#!/usr/bin/env python3
"""Add one pioneer portrait from an image file you already have.

Crops the image to a square (keeping the head, which is usually in the
upper part of a portrait), resizes it to 400x400, saves it as
portraits/<id>.jpg and, if you give a credit, records it in
portraits/credits.js. The site picks up portraits/<id>.jpg on its own,
so the credit is optional, but please record where the photo came from.

Usage:
  python3 tools/add_portrait.py <id> <image> [--artist NAME] [--license TEXT]
                                [--license-url URL] [--source URL]
                                [--focus X,Y] [--zoom Z] [--note TEXT]

  <id>     the person's id in pioneers-data.js, e.g. hassabis
  --focus  optional centre of the face as fractions of width,height
           (default 0.5,0.38), if the automatic crop cuts the head
  --zoom   crop tighter than the full short side (e.g. 1.3)
  --note   a credit note, e.g. "Used with permission of the photographer"

Needs: pip install pillow
"""
import argparse, json, re, sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Install Pillow first: pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "portraits"
CREDITS = OUT / "credits.js"
DATA = ROOT / "pioneers-data.js"


def ids():
    return set(re.findall(r'\{ id:"([a-z]+)"', DATA.read_text(encoding="utf-8")))


def crop(img, fx, fy, zoom=1.0, size=400):
    img = ImageOps.exif_transpose(img).convert("RGB")
    w, h = img.size
    s = int(min(w, h) / max(zoom, 1.0))
    left = min(max(int(fx * w - s / 2), 0), w - s)
    top = min(max(int(fy * h - s / 2), 0), h - s)
    return img.crop((left, top, left + s, top + s)).resize((size, size), Image.LANCZOS)


def save_credit(pid, entry):
    txt = CREDITS.read_text(encoding="utf-8")
    head, _, body = txt.partition("window.PORTRAITS = {")
    body = body.rsplit("};", 1)[0]
    lines = [l for l in body.splitlines() if l.strip() and not re.match(rf"\s*{pid}\s*:", l)]
    lines.append(f"  {pid}: {json.dumps(entry, ensure_ascii=False)},")
    CREDITS.write_text(head + "window.PORTRAITS = {\n" + "\n".join(lines) + "\n};\n", encoding="utf-8")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("id"); ap.add_argument("image")
    ap.add_argument("--artist", default=""); ap.add_argument("--license", default="")
    ap.add_argument("--license-url", default=""); ap.add_argument("--source", default="")
    ap.add_argument("--focus", default="0.5,0.38")
    ap.add_argument("--zoom", type=float, default=1.0)
    ap.add_argument("--note", default="")
    a = ap.parse_args()
    if a.id not in ids():
        sys.exit(f"'{a.id}' is not an id in pioneers-data.js")
    fx, fy = (float(v) for v in a.focus.split(","))
    out = OUT / f"{a.id}.jpg"
    crop(Image.open(a.image), fx, fy, a.zoom).save(out, quality=86, optimize=True)
    print(f"saved {out.relative_to(ROOT)}")
    if a.artist or a.license or a.source or a.note:
        entry = {"file": f"portraits/{a.id}.jpg", "artist": a.artist, "license": a.license,
                 "licenseUrl": a.license_url, "source": a.source}
        if a.note:
            entry["note"] = a.note
        save_credit(a.id, entry)
        print("credit recorded in portraits/credits.js")


if __name__ == "__main__":
    main()

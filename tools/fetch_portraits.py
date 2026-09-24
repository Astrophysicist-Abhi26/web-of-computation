#!/usr/bin/env python3
"""Fetch freely licensed pioneer portraits from Wikimedia Commons.

For each pioneer in pioneers-data.js that has no portrait yet:
  1. ask Wikipedia for the article's lead image,
  2. keep it only if the file is hosted on Commons under a free licence,
  3. download a 400px thumbnail, crop it square (face-biased), save as
     portraits/<id>.jpg,
  4. record the credit in portraits/credits.js.

Usage:  python3 tools/fetch_portraits.py [id ...]
Needs:  pip install pillow ; network access to *.wikipedia.org / *.wikimedia.org
"""
import io, json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Install Pillow first: pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "pioneers-data.js"
OUT = ROOT / "portraits"
CREDITS = OUT / "credits.js"
UA = "WebOfComputation/1.0 (https://github.com/Astrophysicist-Abhi26/web-of-computation)"
FREE = re.compile(r"^(public domain|pd|cc0|cc[- ]by(-sa)?( \d\.\d)?)", re.I)

# Wikipedia article titles where the display name is ambiguous.
TITLES = {
    "turing": "Alan Turing", "shannon": "Claude Shannon", "simon": "Herbert A. Simon",
    "sutton": "Richard S. Sutton", "barto": "Andrew Barto", "silver": "David Silver (computer scientist)",
    "dean": "Jeff Dean", "codd": "Edgar F. Codd", "hopper": "Grace Hopper", "ng": "Andrew Ng",
    "huang": "Jensen Huang", "kingma": "Diederik P. Kingma", "radford": "Alec Radford",
    "olah": "Chris Olah", "kaiminghe": "Kaiming He", "reddy": "Raj Reddy", "pitts": "Walter Pitts",
    "samuel": "Arthur Samuel (computer scientist)", "bellman": "Richard E. Bellman",
}

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

def api(host, **params):
    params.setdefault("format", "json")
    return json.loads(get(f"https://{host}/w/api.php?" + urllib.parse.urlencode(params)))

def people():
    src = DATA.read_text(encoding="utf-8")
    return re.findall(r'\{ id:"([a-z]+)", name:"([^"]+)"', src)

def load_credits():
    if not CREDITS.exists():
        return {}
    txt = CREDITS.read_text(encoding="utf-8")
    body = txt[txt.index("window.PORTRAITS = ") + len("window.PORTRAITS = "):].rstrip().rstrip(";")
    body = re.sub(r"(?m)^\s*//.*$", "", body)          # whole-line comments only
    body = re.sub(r"(?m)^(\s*)(\w+):\s", r'\1"\2": ', body)   # bare keys -> JSON
    body = re.sub(r",(\s*[}\]])", r"\1", body)         # trailing commas
    return json.loads(body) if body.strip() not in ("{}", "{\n}") else {}

def save_credits(credits):
    head = CREDITS.read_text(encoding="utf-8").split("window.PORTRAITS = ")[0]
    lines = ["window.PORTRAITS = {"]
    for pid in sorted(credits):
        lines.append(f"  {pid}: {json.dumps(credits[pid], ensure_ascii=False)},")
    lines.append("};\n")
    CREDITS.write_text(head + "\n".join(lines), encoding="utf-8")

def strip_html(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()

def lookup(pid, name):
    title = TITLES.get(pid, name)
    r = api("en.wikipedia.org", action="query", titles=title, prop="pageimages", piprop="name", redirects=1)
    page = next(iter(r["query"]["pages"].values()))
    fname = page.get("pageimage")
    if not fname:
        return None, "no lead image"
    r = api("commons.wikimedia.org", action="query", titles="File:" + fname, prop="imageinfo",
            iiprop="url|extmetadata", iiurlwidth=400)
    page = next(iter(r["query"]["pages"].values()))
    if "imageinfo" not in page:
        return None, f"{fname} is not on Commons (probably non-free)"
    info = page["imageinfo"][0]
    meta = info.get("extmetadata", {})
    lic = strip_html(meta.get("LicenseShortName", {}).get("value", ""))
    if not FREE.match(lic):
        return None, f"licence '{lic}' is not free"
    return {
        "thumb": info.get("thumburl") or info["url"],
        "artist": strip_html(meta.get("Artist", {}).get("value", "")) or "Unknown",
        "license": lic,
        "licenseUrl": meta.get("LicenseUrl", {}).get("value", ""),
        "source": info.get("descriptionurl", ""),
    }, None

def crop_square(img):
    w, h = img.size
    s = min(w, h)
    left = (w - s) // 2
    top = 0 if h <= w else min(int(h * 0.08), h - s)   # portraits: keep the head
    return img.crop((left, top, left + s, top + s)).resize((320, 320), Image.LANCZOS)

def main(only):
    credits = load_credits()
    for pid, name in people():
        if only and pid not in only:
            continue
        if not only and pid in credits:
            continue
        try:
            hit, why = lookup(pid, name)
        except Exception as e:  # network or API error
            print(f"  ! {pid:12} {e}")
            continue
        if not hit:
            print(f"  - {pid:12} skipped: {why}")
            continue
        img = Image.open(io.BytesIO(get(hit["thumb"]))).convert("RGB")
        crop_square(img).save(OUT / f"{pid}.jpg", quality=84, optimize=True)
        credits[pid] = {"file": f"portraits/{pid}.jpg", "artist": hit["artist"], "license": hit["license"],
                        "licenseUrl": hit["licenseUrl"], "source": hit["source"]}
        print(f"  + {pid:12} {hit['license']} · {hit['artist'][:50]}")
        save_credits(credits)
        time.sleep(0.5)   # be polite to the API

if __name__ == "__main__":
    main(set(sys.argv[1:]))

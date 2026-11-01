#!/usr/bin/env python3
"""Έλεγχος συνέπειας content/: σύνδεσμοι album↔composer↔song, el/en parity,
μορφή πηγών, προαιρετικά HTTP status των εξωτερικών URL.

Χρήση:  python scripts/check_links.py [ROOT] [--http]
Exit code 1 αν υπάρχουν errors (warnings δεν μετράνε).
"""
import json, os, re, sys, glob, ssl, urllib.parse, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

args = [a for a in sys.argv[1:] if not a.startswith("--")]
ROOT = args[0] if args else "."
HTTP = "--http" in sys.argv

errors, warnings = [], []
err = lambda m: errors.append(m)
warn = lambda m: warnings.append(m)


def load(kind):
    out = {}
    for p in sorted(glob.glob(os.path.join(ROOT, "content", kind, "*.json"))):
        try:
            d = json.load(open(p, encoding="utf-8"))
        except Exception as e:
            err(f"{kind}/{os.path.basename(p)}: μη έγκυρο JSON ({e})")
            continue
        slug = d.get("slug")
        fn = os.path.basename(p)[:-5]
        if slug != fn:
            err(f"{kind}/{fn}.json: slug '{slug}' ≠ όνομα αρχείου")
        out[fn] = d
    return out


composers, lyricists = load("composers"), load("lyricists")
albums, songs = load("albums"), load("songs")

URL_RE = re.compile(r"^https?://[^\s/]+\.[^\s/]+")
LABEL_RE = re.compile(r"^.+ — .+")
urls = {}


def check_sources(where, srcs):
    if not srcs:
        warn(f"{where}: καμία πηγή")
        return
    for s in srcs:
        u, lab = s.get("url", ""), s.get("label", "")
        if not URL_RE.match(u):
            err(f"{where}: άκυρο URL '{u}'")
        else:
            urls.setdefault(u, []).append(where)
        if not LABEL_RE.match(lab):
            warn(f"{where}: label χωρίς μοτίβο «Site — περιγραφή»: '{lab}'")


def check_en(where, d, keys):
    en = d.get("en")
    if not en:
        err(f"{where}: λείπει το block en")
        return
    for k in keys:
        a, b = d.get(k), en.get(k)
        if a is None:
            continue
        if b is None:
            err(f"{where}: en.{k} λείπει")
        elif isinstance(a, list) and len(a) != len(b):
            err(f"{where}: en.{k} μήκος {len(b)} ≠ {len(a)}")


for slug, c in composers.items():
    w = f"composer/{slug}"
    for k in ("name", "born", "bio", "fileNo"):
        if not c.get(k):
            err(f"{w}: λείπει {k}")
    check_en(w, c, ["lifespan", "tagline", "bio", "interviews"])
    check_sources(w, c.get("sources"))
    if not any(a.get("composer") == slug for a in albums.values()):
        warn(f"{w}: χωρίς δίσκους")

for slug, l in lyricists.items():
    check_sources(f"lyricist/{slug}", l.get("sources"))
    for sec in l.get("sections", []):
        for s in sec.get("songs", []):
            if s.get("song") and s["song"] not in songs:
                err(f"lyricist/{slug}: song '{s['song']}' δεν υπάρχει")

VALID_TYPES = {"cycle", "film", "theatre", "instrumental", "rebetiko", "anthology"}
GRADES = {"SSS", "SS", "S", "A", "B", "C", "D"}
for slug, a in albums.items():
    w = f"album/{slug}"
    if a.get("composer") not in composers:
        err(f"{w}: composer '{a.get('composer')}' δεν έχει αρχείο")
    if a.get("type") not in VALID_TYPES:
        err(f"{w}: type '{a.get('type')}' άκυρο")
    if a.get("grade") not in GRADES:
        warn(f"{w}: grade '{a.get('grade')}' άγνωστο")
    if not str(a.get("year", "")).isdigit():
        err(f"{w}: year '{a.get('year')}' όχι αριθμός")
    if not a.get("tracks"):
        warn(f"{w}: χωρίς tracks")
    for t in a.get("tracks", []):
        if t.get("song") and t["song"] not in songs:
            err(f"{w}: track '{t.get('title')}' → song '{t['song']}' δεν υπάρχει")
    check_en(w, a, ["kind", "about"])
    check_sources(w, a.get("sources"))
    if not a.get("sources"):
        err(f"{w}: δίσκος χωρίς πηγή")

for slug, s in songs.items():
    for k in ("composer", "lyricist"):
        pass  # names only (βλ. SongArticle)

if HTTP:
    def head(u):
        q = urllib.parse.quote(u, safe=":/?&=%#@+,;~")
        req = urllib.request.Request(q, method="GET", headers={"User-Agent": "Mozilla/5.0 link-check"})
        try:
            # μόνο έλεγχος προσβασιμότητας· ανοχή σε ελλιπείς αλυσίδες πιστοποιητικών
            with urllib.request.urlopen(req, timeout=15, context=ssl._create_unverified_context()) as r:
                return u, r.status
        except urllib.error.HTTPError as e:
            return u, e.code
        except Exception as e:
            return u, str(e)[:60]
    with ThreadPoolExecutor(8) as ex:
        for u, st in ex.map(head, list(urls)):
            if st != 200:
                # Discogs αποκρίνεται 403 σε bots· warning, όχι error
                (warn if st in (403, 429) else err)(f"HTTP {st}: {u}  ← {urls[u][0]}")

print(f"composers={len(composers)} lyricists={len(lyricists)} albums={len(albums)} songs={len(songs)} urls={len(urls)}")
for m in errors:
    print("ERROR  ", m)
for m in warnings:
    print("warning", m)
print(f"== {len(errors)} errors, {len(warnings)} warnings")
sys.exit(1 if errors else 0)

# -*- coding: utf-8 -*-
"""
Για κάθε στιχουργό (content/lyricists/*.json):
- συνδέει κάθε δισκογραφημένο τραγούδι του με υπάρχουσα σελίδα του site (αν υπάρχει),
  αλλιώς δημιουργεί σελίδα στοιχείων (isStub, origin: lyricist, βαθμός C) — ΧΩΡΙΣ στίχους,
- προσθέτει σε κάθε σελίδα το «textSource»: πού βρίσκεται το επίσημο κείμενο.
Τρέχει ΜΕΤΑ το build_song_stubs.py.
"""
import json, os, glob, sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from songkeys import key, slugify

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
SNG = os.path.join(ROOT, "content", "songs")
LYR = os.path.join(ROOT, "content", "lyricists")

songs = {}
prev_lyr = set()   # σελίδες που είχε φτιάξει παλαιότερο τρέξιμο (δεν σβήνονται — κρύβονται αν περισσεύουν)
for f in glob.glob(os.path.join(SNG, "*.json")):
    d = json.load(open(f))
    if d.get("hidden"):
        continue
    if d.get("origin") == "lyricist":
        prev_lyr.add(d["slug"])
        continue
    songs.setdefault(key(d["title"]), d)
used = {d["slug"] for d in songs.values()} | {os.path.basename(f)[:-5] for f in glob.glob(os.path.join(SNG, "*.json"))}

def clean_title(t):
    return re.sub(r"\s*\([^)]*\)\s*$", "", t).strip() or t

for lf in glob.glob(os.path.join(LYR, "*.json")):
    L = json.load(open(lf))
    name = L["name"]
    created = linked = 0
    touched = set()
    produced = set()
    for sec in L["sections"]:
        if not sec.get("makePages"):
            continue
        for x in sec["songs"]:
            url = f"https://gatsosarchive.org/song/{x['archive']}/"
            ts = {"label": "Gatsos Archive — το επίσημο κείμενο", "url": url,
                  "book": f"Νίκος Γκάτσος, «Όλα τα τραγούδια» (Πατάκης){', σ. ' + x['page'] if x.get('page') else ''}"}
            ts_en = {"label": "Gatsos Archive — the official text",
                     "book": f"Nikos Gatsos, “Ola ta tragoudia” (Patakis){', p. ' + x['page'] if x.get('page') else ''}"}
            k = key(x["title"])
            d = songs.get(k) or songs.get(key(clean_title(x["title"])))
            if d and d.get("origin") == "lyricist" and d["slug"] in produced:
                x["song"] = d["slug"]; continue
            if d and d["slug"] in touched:
                x["song"] = d["slug"]; continue
            if d:
                touched.add(d["slug"])
                # υπάρχουσα σελίδα: προσθέτουμε μόνο πηγή κειμένου (+ στιχουργό αν λείπει)
                d["textSource"] = ts
                d.setdefault("en", {})["textSource"] = ts_en
                if not d.get("lyricist") and not d.get("isProfile"):
                    d["lyricist"] = name
                if not x.get("composer") and d.get("composer"):
                    x["composer"] = d["composer"]
                json.dump(d, open(os.path.join(SNG, d["slug"] + ".json"), "w"), ensure_ascii=False, indent=2)
                x["song"] = d["slug"]; linked += 1
                continue
            title = clean_title(x["title"])
            slug = slugify(title)
            base, n = slug, 2
            while slug in used and slug not in prev_lyr:
                slug = f"{base}-{n}"; n += 1
            while slug in produced:
                slug = f"{base}-{n}"; n += 1
            produced.add(slug)
            used.add(slug)
            parts = [p for p in [x.get("composer") and f"μουσική {x['composer']}", x.get("year") and f"πρώτη δισκογράφηση {x['year']}"] if p]
            parts_en = [p for p in [x.get("composer") and f"music by {x['composer']}", x.get("year") and f"first recorded {x['year']}"] if p]
            d = {
                "slug": slug, "title": title, "composer": x.get("composer"), "lyricist": name,
                "year": x.get("year") or "", "performer": x.get("performer"),
                "status": "stub", "grade": "C", "isStub": True, "origin": "lyricist", "archive": x["archive"],
                "teaser": f"Στίχοι {name.replace('Νίκος', 'Νίκου').replace('Γκάτσος', 'Γκάτσου')}" + (" — " + ", ".join(parts) if parts else "") + ".",
                "story": [],
                "sources": [{"label": f"The Gatsos Archive — {x['title']}", "url": url}] + ([{"label": x["recordLabel"], "url": x["recordUrl"]}] if x.get("recordUrl") else []),
                "coverVideoUrl": None,
                "textSource": ts,
                "en": {"teaser": "Lyrics by Nikos Gatsos" + (" — " + ", ".join(parts_en) if parts_en else "") + ".", "story": [], "textSource": ts_en},
            }
            json.dump(d, open(os.path.join(SNG, slug + ".json"), "w"), ensure_ascii=False, indent=2)
            songs[k] = d
            x["song"] = slug; created += 1
    json.dump(L, open(lf, "w"), ensure_ascii=False, indent=2)
    for slug in prev_lyr - produced:
        json.dump({"slug": slug, "title": slug, "hidden": True}, open(os.path.join(SNG, slug + ".json"), "w"))
    print(f"{name}: {linked} συνδέθηκαν με υπάρχουσες σελίδες, {created} νέες σελίδες")

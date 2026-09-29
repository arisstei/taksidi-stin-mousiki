# -*- coding: utf-8 -*-
"""Εφαρμόζει τεκμηριωμένες ιστορίες (scripts/data/stories/*.json) και εκτελέσεις
YouTube (scripts/data/videos.json) στις σελίδες τραγουδιών. Δεν αγγίζει τίποτα
άλλο. Μετά: αν μια σελίδα απέκτησε ιστορία, φεύγει το isStub και το stub από
τα tracks των δίσκων."""
import json, glob, os
ROOT = os.path.join(os.path.dirname(__file__), "..")
S = os.path.join(ROOT, "content", "songs")
def load(p): return json.load(open(p, encoding="utf-8"))
def save(p, d): json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=2); open(p, "a").write("\n")

stories = {}
for f in sorted(glob.glob(os.path.join(ROOT, "scripts/data/stories/*.json"))):
    for e in load(f): stories[e["slug"]] = e
vids = load(os.path.join(ROOT, "scripts/data/videos.json")) if os.path.exists(os.path.join(ROOT, "scripts/data/videos.json")) else {}

upgraded = set()
for slug, e in stories.items():
    p = os.path.join(S, slug + ".json")
    if not os.path.exists(p): print("λείπει", slug); continue
    d = load(p)
    d["story"] = e["story"]; d["teaser"] = e["teaser"]; d["grade"] = e["grade"]
    d["status"] = "verified" if e["grade"] in ("A", "S", "SS", "SSS") else "documented"
    d.pop("isStub", None)
    src = e.get("sources", [])
    have = {x["url"] for x in d.get("sources", [])}
    d["sources"] = [x for x in d.get("sources", []) if x["url"] not in {y["url"] for y in src}] + src
    for k in ("firstPerformance", "famousPerformance", "caveat"):
        if k in e: d[k] = e[k]
    d.setdefault("en", {}); d["en"].update(e.get("en", {}))
    save(p, d); upgraded.add(slug)

for slug, v in vids.items():
    p = os.path.join(S, slug + ".json")
    if not os.path.exists(p): continue
    d = load(p)
    url = "https://www.youtube.com/watch?v=" + v["id"]
    perf = {"performer": v.get("performer"), "year": v.get("year"), "note": v.get("note"), "videoUrl": url, "videoLabel": v["label"]}
    perf = {k: x for k, x in perf.items() if x}
    kind = v.get("kind", "recording")
    d[kind] = perf
    if v.get("noteEn") or v.get("performer"):
        d.setdefault("en", {}).setdefault(kind, {})
        if v.get("noteEn"): d["en"][kind]["note"] = v["noteEn"]
    save(p, d)

# tracks δίσκων
for f in glob.glob(os.path.join(ROOT, "content/albums/*.json")):
    a = load(f); ch = False
    for t in a.get("tracks", []):
        if t.get("song") in upgraded and t.get("stub"):
            t.pop("stub"); ch = True
    if ch: save(f, a)
print("ιστορίες:", len(upgraded), "βίντεο:", len(vids))

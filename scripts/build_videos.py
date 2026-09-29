# -*- coding: utf-8 -*-
"""videos_raw.txt (slug|youtubeId|επίσημο(1/0)|ερμηνευτής) -> videos.json"""
import json, os
R = os.path.dirname(__file__)
out = {}
for line in open(os.path.join(R, "data/videos_raw.txt"), encoding="utf-8"):
    line = line.rstrip("\n")
    if not line.strip(): continue
    slug, vid, off, perf = (line.split("|") + [""])[:4]
    song = json.load(open(os.path.join(R, "..", "content/songs", slug + ".json"), encoding="utf-8"))
    title = song["title"]
    label = f"{perf} — {title}" if perf else title
    v = {"id": vid, "kind": "recording", "label": label}
    if perf: v["performer"] = perf
    if off == "1":
        v["note"] = "Ανάρτηση από επίσημο κανάλι στο YouTube."
        v["noteEn"] = "Posted by an official YouTube channel."
    else:
        v["note"] = "Ανάρτηση χρήστη στο YouTube — όχι επίσημη κυκλοφορία· ο σύνδεσμος μπορεί κάποια στιγμή να αφαιρεθεί."
        v["noteEn"] = "A user upload on YouTube — not an official release; the link may be removed at some point."
    out[slug] = v
json.dump(out, open(os.path.join(R, "data/videos.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(out))

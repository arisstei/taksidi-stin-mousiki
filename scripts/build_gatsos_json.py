# -*- coding: utf-8 -*-
"""Συνθέτει το content/lyricists/nikos-gatsos.json από τα αρχεία του scripts/data/."""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
D = os.path.join(H, "data")
ROOT = os.path.dirname(H)
base = json.load(open(os.path.join(D, "gatsos_base.json")))
rows = [l.split("|") for l in open(os.path.join(D, "gatsos_list.txt")).read().strip().split("\n")]
pages = open(os.path.join(D, "gatsos_pages.txt")).read().strip().split(",")
order = [rows[1][1], rows[0][1]] + [r[1] for r in rows[2:]]  # η σειρά με την οποία μαζεύτηκαν οι σελίδες
page = {s: (p if p != "-" else None) for s, p in zip(order, pages)}
comp = {}
for l in open(os.path.join(D, "gatsos_composers.txt")).read().strip().split("\n"):
    s, c, y = (l.split("|") + ["", ""])[:3]
    comp[s] = (c or None, y or None)
SECTIONS = [
    ("R", "recorded", "Τραγούδια με σειρά δισκογράφησης", "Songs in order of recording", True, None, None),
    ("A", "amorgos", "Από την «Αμοργό» — αποσπάσματα που μελοποιήθηκαν", "From “Amorgos” — excerpts set to music", False,
     "Αποσπάσματα από το ποίημα του 1943, όπως τα κατατάσσει ο τόμος.", "Excerpts from the 1943 poem, as arranged in the volume."),
    ("M", "itan-tou-mai", "«Ήταν του Μάη το πρόσωπο» — ενιαίο έργο", "“Itan tou Mai to prosopo” — a stand-alone work", False, None, None),
    ("E", "meres-epitafiou", "«Μέρες Επιταφίου» — ενιαίο έργο", "“Meres Epitafiou” — a stand-alone work", False, None, None),
    ("U1", "unrecorded-1980", "Αδισκογράφητοι στίχοι — ως το 1980", "Unrecorded lyrics — up to 1980", False, None, None),
    ("U2", "unrecorded-1991", "Αδισκογράφητοι στίχοι — 1981–1991", "Unrecorded lyrics — 1981–1991", False, None, None),
]
secs, secs_en = [], []
for code, sid, t_el, t_en, make, n_el, n_en in SECTIONS:
    songs = []
    for i, r in enumerate([r for r in rows if r[0] == code], 1):
        c, y = comp.get(r[1], (None, None))
        x = {"n": i, "title": r[2], "archive": r[1]}
        if page.get(r[1]): x["page"] = page[r[1]]
        if c: x["composer"] = c
        if y: x["year"] = y
        songs.append(x)
    s = {"id": sid, "title": t_el, "makePages": make, "songs": songs}
    if n_el: s["note"] = n_el
    secs.append(s)
    e = {"title": t_en}
    if n_en: e["note"] = n_en
    secs_en.append(e)
base["sections"] = secs
base["en"]["sections"] = secs_en
os.makedirs(os.path.join(ROOT, "content", "lyricists"), exist_ok=True)
json.dump(base, open(os.path.join(ROOT, "content", "lyricists", "nikos-gatsos.json"), "w"), ensure_ascii=False, indent=2)
print({s["id"]: len(s["songs"]) for s in secs}, "με συνθέτη:", sum(1 for s in secs for x in s["songs"] if x.get("composer")))

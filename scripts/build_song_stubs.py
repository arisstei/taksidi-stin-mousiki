# -*- coding: utf-8 -*-
"""
Δημιουργεί σελίδα για ΚΑΘΕ τραγούδι κάθε δίσκου (content/albums/*.json).
- Τραγούδια που έχουν ήδη άρθρο-ιστορία (content/songs/*.json χωρίς isStub) δεν αγγίζονται·
  απλώς συνδέονται από όλους τους δίσκους όπου εμφανίζονται.
- Για τα υπόλοιπα γράφεται "σελίδα στοιχείων" (isStub: true, βαθμός Γ): μόνο
  τα δισκογραφικά στοιχεία, ΚΑΜΙΑ ιστορία χωρίς πηγή.
- Το ίδιο τραγούδι σε πολλούς δίσκους = μία σελίδα (ταύτιση με "φωνητικό" κλειδί τίτλου).
Ξανατρέχει με ασφάλεια: σβήνει/ξαναγράφει μόνο τα stubs.
"""
import json, os, re, glob, unicodedata, sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
ALB = os.path.join(ROOT, "content", "albums")
SNG = os.path.join(ROOT, "content", "songs")

def strip_acc(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")

ALIASES = {
    "χασαπικο σαραντα": "χασαπικο 40", "χασαπικο '40": "χασαπικο 40",
    "παει εφυγε το τρενο": "εφυγε το τρενο",
    "μαγικη πολη": "μια πολη μαγικη", "ο κεμαλ η ο μυθος του σεβαχ": "κεμαλ", "πάει έφυγε το τραίνο": "εφυγε το τρενο",
}

def key(title):
    t = re.sub(r"\([^)]*\)", " ", title)
    t = t.split("—")[0]
    t = strip_acc(t.lower())
    t = t.replace("τραινο", "τρενο")
    t = re.sub(r"[’'`΄«»\"“”.,;:!?·\-–]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    t = ALIASES.get(t, t)
    # φωνητική κανονικοποίηση για ορθογραφικές παραλλαγές (παλληκάρι/παλικάρι κ.λπ.)
    k = t
    for a, b in [("ει", "ι"), ("οι", "ι"), ("η", "ι"), ("υ", "ι"), ("ω", "ο"), ("αι", "ε")]:
        k = k.replace(a, b)
    k = re.sub(r"(.)\1", r"\1", k)
    k = re.sub(r"^(ο|η|το|οι|τα|ι) ", "", k)  # άρθρο στην αρχή
    return k

TR = {"α":"a","β":"v","γ":"g","δ":"d","ε":"e","ζ":"z","η":"i","θ":"th","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"x","ο":"o","π":"p","ρ":"r","σ":"s","ς":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"o"}
def slugify(title):
    t = strip_acc(re.sub(r"\([^)]*\)", " ", title).split("—")[0].lower())
    t = t.replace("ου", "ou").replace("αι", "ai").replace("ει", "ei").replace("οι", "oi").replace("μπ", "mp").replace("ντ", "nt").replace("γκ", "gk")
    out = "".join(TR.get(c, c) for c in t)
    out = re.sub(r"[^a-z0-9]+", "-", out).strip("-")
    return out or "song"

EXCLUDE_RE = re.compile(r"(^|\s)(Πρόλογος|Εισαγωγή|Επίλογος|Φινάλε|Τίτλοι|Είσοδος|Σχόλιο|Θέμα|Main Title|End Title|Overture|Μουσική για|Χορός των|Χορός της|Χορός του|Ο χορός)|ορχηστρικ|Ορχήστρα|\(ορχήστρα\)|·", re.I)
MANUAL_EXCLUDE = {"Η σφαγή", "Κερκέζικο τραγούδι (Το μοτίβο της Εμινέ)", "Όνειρο για τεντυμπόυδες (Τουίστ)", "Χατζί-Χατζί (Χορός σε 5/8)", "Άστρο της Ανατολής (Χασάπικο)", "Η βροχή", "Πηγαίνοντας για βροχή", "Πού είναι η Μελισσάνθη;", "Ελεημοσύνη από τον ουρανό", "Μικρή μπαντίνα στον δρόμο", "Το εμβατήριο της Μελισσάνθης", "Χορός της Μελισσάνθης που γίνεται λησμονημένη", "Dance Of The Dogs", "The Three Answers", "Ο χορός των σκύλων", "Τρεις απαντήσεις", "Μελαγχολικό εμβατήριο", "Τσάμικος"}
# τα Τσάμικος/Μελαγχολικό εμβατήριο της «Αθανασίας» είναι τραγούδια; στη «Λαϊκή Αγορά» ο Τσάμικος έχει στίχους Γκάτσου — τον επιτρέπουμε όταν έχει στιχουργό
CREATE_TYPES = {"cycle", "theatre", "anthology", "film", "rebetiko", "instrumental"}
LINK_ONLY_ALBUMS = {"dekapente-esperinoi", "30-nyxterina", "to-xamogelo-tis-tzokontas", "pasxalies-mesa-apo-ti-nekri-gi", "o-skliros-aprilis-tou-45", "ta-perix", "gia-mia-mikri-leyki-axivada", "topkapi", "blue", "memed-geraki-mou"}

albums = [json.load(open(f)) for f in sorted(glob.glob(os.path.join(ALB, "*.json")))]
albums.sort(key=lambda a: (int(a.get("year") or 0), a["slug"]))

# υπάρχοντα άρθρα-ιστορίες
stories = {}
old_stubs = {}        # κλειδί -> slug παλιού stub (κρατάμε σταθερά τα URLs)
old_stub_files = set()  # δεν μπορούμε να σβήσουμε αρχεία· τα ορφανά κρύβονται (hidden)
for f in glob.glob(os.path.join(SNG, "*.json")):
    d = json.load(open(f))
    if d.get("isStub") or d.get("hidden"):
        old_stubs[key(d["title"])] = d["slug"]
        old_stub_files.add(d["slug"])
        continue
    stories[key(d["title"])] = d["slug"]
used_slugs = {v for v in stories.values()}

songs = {}  # key -> dict
HARD_EXCLUDE = re.compile(r"^(Prologue|Finale|Πρόλογος|Επίλογος|Εισαγωγή)\b", re.I)
def eligible(album, tr, album_has_perf):
    title = tr["title"]
    if HARD_EXCLUDE.search(title):
        return False
    if tr.get("orig"):
        return False  # ρεμπέτικα άλλων συνθετών
    if title in MANUAL_EXCLUDE and not tr.get("lyricist"):
        return False
    if EXCLUDE_RE.search(title) and not tr.get("lyricist"):
        return False
    if album["slug"] in LINK_ONLY_ALBUMS and not tr.get("lyricist"):
        return False
    if album["type"] in ("film", "instrumental") and not (tr.get("lyricist") or tr.get("performer")):
        return False
    if album_has_perf and not (tr.get("performer") or tr.get("lyricist")):
        return False
    if tr.get("performer") and re.search(r"ορχήστρα|πιάνο\)$|\(πιάνο\)|μπουζούκι\)$", tr["performer"], re.I) and not tr.get("lyricist"):
        return False
    return True

# Πέρασμα 1: ποια τραγούδια δικαιούνται σελίδα (από οποιονδήποτε δίσκο)
for album in albums:
    album_has_perf = sum(1 for t in album["tracks"] if t.get("performer")) * 2 >= len(album["tracks"])
    for tr in album["tracks"]:
        if tr.get("stub"):
            tr.pop("song", None); tr.pop("stub", None)
        k = key(tr["title"])
        if k in stories or tr.get("song") or k in songs:
            continue
        if eligible(album, tr, album_has_perf):
            title = re.sub(r"\s*—\s*.*$", "", tr["title"]).strip()
            slug = old_stubs.get(k) or slugify(title)
            base, n = slug, 2
            while slug in used_slugs:
                slug = f"{base}-{n}"; n += 1
            used_slugs.add(slug)
            songs[k] = {"slug": slug, "title": title, "albums": [], "performers": [], "lyricist": None, "year": album["year"]}

# Πέρασμα 2: σύνδεση ΚΑΘΕ κομματιού κάθε δίσκου με τη σελίδα του (αν υπάρχει)
for album in albums:
    single_perf = album["performers"][0] if len(album.get("performers") or []) == 1 else None
    single_lyr = album["lyricists"][0] if len(album.get("lyricists") or []) == 1 else None
    for tr in album["tracks"]:
        k = key(tr["title"])
        if HARD_EXCLUDE.search(tr["title"]):
            continue
        if k in stories:
            tr["song"] = stories[k]
            continue
        if tr.get("song") or k not in songs:
            continue
        s = songs[k]
        s["albums"].append((album["slug"], album["title"], album["year"], album.get("sources", [{}])[0]))
        perf = tr.get("performer") or (single_perf if album["type"] != "instrumental" and album["slug"] not in LINK_ONLY_ALBUMS else None)
        if perf and perf not in s["performers"] and not re.search(r"ορχήστρα|πιάνο|διεύθυνση", perf, re.I):
            s["performers"].append(perf)
        lyr = tr.get("lyricist") or single_lyr
        if lyr and not s["lyricist"]:
            s["lyricist"] = lyr
        tr["song"] = s["slug"]; tr["stub"] = True

for album in albums:
    json.dump(album, open(os.path.join(ALB, album["slug"] + ".json"), "w"), ensure_ascii=False, indent=2)

for k, s in songs.items():
    first = s["albums"][0]
    names = ", ".join(f"«{a[1]}» ({a[2]})" for a in s["albums"][:3])
    names_en = ", ".join(f"“{a[1]}” ({a[2]})" for a in s["albums"][:3])
    more = len(s["albums"]) - 3
    d = {
        "slug": s["slug"], "title": s["title"], "composer": "Μάνος Χατζιδάκις",
        "lyricist": s["lyricist"], "year": str(first[2]),
        "performer": " · ".join(s["performers"][:3]) or None,
        "status": "stub", "grade": "C", "isStub": True,
        "teaser": ("Από τον δίσκο " if len(s["albums"]) == 1 else "Από τους δίσκους ") + names + (f" και {more} ακόμη" if more > 0 else "") + ".",
        "story": [],
        "sources": [a[3] for a in s["albums"] if a[3].get("url")][:4],
        "coverVideoUrl": None,
        "en": {"teaser": ("From the album " if len(s["albums"]) == 1 else "From the albums ") + names_en + (f" and {more} more" if more > 0 else "") + ".", "story": []},
    }
    # μοναδικές πηγές
    seen = set(); d["sources"] = [x for x in d["sources"] if not (x["url"] in seen or seen.add(x["url"]))]
    json.dump(d, open(os.path.join(SNG, s["slug"] + ".json"), "w"), ensure_ascii=False, indent=2)

live = {s_["slug"] for s_ in songs.values()}
for slug in old_stub_files - live:
    json.dump({"slug": slug, "title": slug, "hidden": True}, open(os.path.join(SNG, slug + ".json"), "w"))
print(f"{len(songs)} σελίδες τραγουδιών (stubs), {len(stories)} άρθρα-ιστορίες")

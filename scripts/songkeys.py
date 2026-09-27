# -*- coding: utf-8 -*-
"""Κοινές συναρτήσεις: κλειδί ταύτισης τίτλων και slug."""
import re, unicodedata

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
    t = re.sub(r"(^| )κι( |$)", r"\1και\2", t)
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


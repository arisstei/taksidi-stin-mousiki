import { getAllAlbums } from "./albums";

// Ερμηνευτές: παράγονται από album.performers[] και tracks[].performer όλων των
// δίσκων. Τα ονόματα καθαρίζονται από παρενθέσεις (π.χ. "(αφήγηση)"), σπάνε σε
// ", " / " & " / " και " και ενοποιούνται ανεξάρτητα από τόνους/πεζά.

function foldKey(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ς/g, "σ")
    .replace(/[\s.]+/g, " ")
    .trim();
}

// Σύνολα/όργανα που δεν είναι πρόσωπα-ερμηνευτές.
const SKIP_RE = /^(ορχηστρα|orchestra|χορωδια|choir|chorus|διαφοροι|various|εργο|οργανα)(\s|$)/i;

const TR = { α:"a",β:"v",γ:"g",δ:"d",ε:"e",ζ:"z",η:"i",θ:"th",ι:"i",κ:"k",λ:"l",μ:"m",ν:"n",ξ:"x",ο:"o",π:"p",ρ:"r",σ:"s",ς:"s",τ:"t",υ:"y",φ:"f",χ:"x",ψ:"ps",ω:"o" };

// Greek -> Latin slug (ίδιο σκεπτικό με scripts/songkeys.py).
export function slugifyName(name) {
  let t = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  t = t.replace(/ου/g, "ou").replace(/αι/g, "ai").replace(/ει/g, "ei").replace(/οι/g, "oi").replace(/μπ/g, "mp").replace(/ντ/g, "nt").replace(/γκ/g, "gk");
  const out = [...t].map((c) => TR[c] ?? c).join("").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return out || "performer";
}

// Περιγραφές/γενικά αντί για ονόματα: άρθρο στην αρχή ("Ο ", "Η ", "Οι "...),
// πεζό αρχικό, ή λέξεις-κλειδιά (συμμετοχή, θίασος, χορωδία, ορχήστρα...).
const NOISE_RE = /(^|\s)(συμμετοχ|θιασ|χορωδι|ορχηστρ|συνολο|μουσικοι)/;
const ARTICLE_RE = /^(ο|η|οι|το|τα|των|του|της)\s/i;
function isNoise(name) {
  if (ARTICLE_RE.test(name)) return true;
  const first = name.charAt(0);
  if (first && first === first.toLowerCase() && first !== first.toUpperCase()) return true;
  return NOISE_RE.test(foldKey(name));
}

export function splitPerformerNames(raw) {
  if (!raw || typeof raw !== "string") return [];
  // αφαίρεση παρενθέσεων (και εμφωλευμένων, αν υπάρχουν)
  let s = raw;
  for (let i = 0; i < 3; i++) s = s.replace(/\([^()]*\)/g, " ");
  s = s.replace(/[()]/g, " ");
  return s
    .split(/\s*,\s*|\s+&\s+|\s+\/\s+|\s*;\s*|\s+και\s+|\s+and\s+/i)
    .map((p) => p.replace(/\s+/g, " ").replace(/^[\s\-–—·]+|[\s\-–—·.]+$/g, "").trim())
    .filter((p) => p && p.length > 1 && !SKIP_RE.test(foldKey(p)) && !isNoise(p));
}

let _cache = null;

export function getAllPerformers() {
  if (_cache && process.env.NODE_ENV === "production") return _cache;
  const map = new Map();
  for (const album of getAllAlbums()) {
    const names = [];
    for (const p of album.performers || []) names.push(...splitPerformerNames(p));
    for (const t of album.tracks || []) names.push(...splitPerformerNames(t.performer));
    for (const name of names) {
      const k = foldKey(name);
      if (!k) continue;
      let e = map.get(k);
      if (!e) {
        e = { key: k, name, albums: [], _seen: new Set() };
        map.set(k, e);
      }
      if (!e._seen.has(album.slug)) {
        e._seen.add(album.slug);
        e.albums.push({ slug: album.slug, title: album.title, year: album.year, composer: album.composer });
      }
    }
  }
  // Σταθερά, μοναδικά slugs: ταξινόμηση κατά κλειδί, και σε σύγκρουση -2, -3...
  const used = new Set();
  const entries = [...map.values()].sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  for (const e of entries) {
    const base = slugifyName(e.name);
    let slug = base;
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
    used.add(slug);
    e.slug = slug;
    e.albums.sort((a, b) => (Number(a.year) || 0) - (Number(b.year) || 0) || String(a.title).localeCompare(String(b.title), "el"));
  }
  _cache = entries
    .map(({ _seen, key, ...e }) => ({ ...e, albumCount: e.albums.length }))
    .sort((a, b) => b.albumCount - a.albumCount || a.name.localeCompare(b.name, "el"));
  return _cache;
}

export function getPerformerBySlug(slug) {
  return getAllPerformers().find((p) => p.slug === slug) || null;
}

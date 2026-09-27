import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "content", "lyricists");

export function getAllLyricists() {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf-8")));
}

export function getLyricistBySlug(slug) {
  return getAllLyricists().find((l) => l.slug === slug) || null;
}

export function localizeLyricist(l, lang) {
  if (!l || lang !== "en" || !l.en) return l;
  const en = l.en;
  return {
    ...l,
    lifespan: en.lifespan || l.lifespan,
    tagline: en.tagline || l.tagline,
    bio: en.bio || l.bio,
    interviews: (l.interviews || []).map((iv, i) => ({ ...iv, ...((en.interviews || [])[i] || {}) })),
    sections: (l.sections || []).map((s, i) => ({ ...s, ...(((en.sections || [])[i]) || {}), songs: s.songs })),
  };
}

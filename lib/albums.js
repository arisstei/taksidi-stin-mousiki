import fs from "fs";
import path from "path";

// Δισκογραφίες: κάθε δίσκος είναι ένα JSON στο content/albums/, κάθε συνθέτης
// στο content/composers/. Ο τίτλος δίσκου/τραγουδιού ΔΕΝ μεταφράζεται ποτέ —
// στα αγγλικά αλλάζουν μόνο τα κείμενα περιγραφής (πεδίο "en").

const ALBUMS_DIR = path.join(process.cwd(), "content", "albums");
const COMPOSERS_DIR = path.join(process.cwd(), "content", "composers");

function readDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")));
}

export function getAllAlbums() {
  return readDir(ALBUMS_DIR).sort(
    (a, b) =>
      (Number(a.year) || 0) - (Number(b.year) || 0) ||
      a.title.localeCompare(b.title, "el")
  );
}

export function getAlbumBySlug(slug) {
  return getAllAlbums().find((a) => a.slug === slug) || null;
}

export function getAlbumsByComposer(composerSlug) {
  return getAllAlbums().filter((a) => a.composer === composerSlug);
}

export function getAllComposers() {
  return readDir(COMPOSERS_DIR);
}

export function getComposerBySlug(slug) {
  return getAllComposers().find((c) => c.slug === slug) || null;
}

// Βρίσκει σε ποιους δίσκους εμφανίζεται ένα τραγούδι-άρθρο (μέσω tracks[].song).
export function getAlbumsForSong(songSlug) {
  return getAllAlbums().filter((a) =>
    (a.tracks || []).some((t) => t.song === songSlug)
  );
}

const pick = (el, en, lang) =>
  lang === "en" && en !== undefined && en !== null ? en : el;

export function localizeAlbum(album, lang) {
  if (!album || lang !== "en" || !album.en) return album;
  const en = album.en;
  return {
    ...album,
    kind: pick(album.kind, en.kind, lang),
    about: pick(album.about, en.about, lang),
    teaser: pick(album.teaser, en.teaser, lang),
    interviewVideo: album.interviewVideo
      ? { ...album.interviewVideo, ...(en.interviewVideo || {}) }
      : album.interviewVideo,
  };
}

export function localizeComposer(c, lang) {
  if (!c || lang !== "en" || !c.en) return c;
  const en = c.en;
  return {
    ...c,
    lifespan: pick(c.lifespan, en.lifespan, lang),
    tagline: pick(c.tagline, en.tagline, lang),
    bio: pick(c.bio, en.bio, lang),
    eras: pick(c.eras, en.eras, lang),
    interviews: (c.interviews || []).map((iv, i) => ({
      ...iv,
      ...((en.interviews || [])[i] || {}),
    })),
  };
}

export { sleeveFor } from "./sleeves";

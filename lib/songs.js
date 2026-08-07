import fs from "fs";
import path from "path";

const SONGS_DIR = path.join(process.cwd(), "content", "songs");

export function getAllSongs() {
  const files = fs.readdirSync(SONGS_DIR).filter((f) => f.endsWith(".json"));
  const songs = files.map((file) => {
    const raw = fs.readFileSync(path.join(SONGS_DIR, file), "utf-8");
    return JSON.parse(raw);
  });
  // verified first, then needs-source
  return songs.sort((a, b) => {
    if (a.status === b.status) return a.title.localeCompare(b.title, "el");
    return a.status === "verified" ? -1 : 1;
  });
}

export function getSongBySlug(slug) {
  const filePath = path.join(SONGS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function getAllSlugs() {
  const files = fs.readdirSync(SONGS_DIR).filter((f) => f.endsWith(".json"));
  return files.map((f) => f.replace(/\.json$/, ""));
}

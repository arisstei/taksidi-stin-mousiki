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

// Επιστρέφει το τραγούδι με τα αγγλικά πεδία (song.en.*) να αντικαθιστούν τα
// ελληνικά, εκεί όπου υπάρχει μετάφραση — ονόματα προσώπων (συνθέτης,
// στιχουργός, ερμηνευτής) παραμένουν στα ελληνικά, όπως συνηθίζεται.
export function localizeSong(song, lang) {
  if (!song || lang !== "en" || !song.en) return song;
  const en = song.en;
  const merge = (base, patch) => (base ? { ...base, ...(patch || {}) } : base);
  return {
    ...song,
    title: en.title || song.title,
    film: en.film || song.film,
    teaser: en.teaser || song.teaser,
    story: en.story || song.story,
    quote: en.quote !== undefined ? en.quote : song.quote,
    quoteAttribution:
      en.quoteAttribution !== undefined ? en.quoteAttribution : song.quoteAttribution,
    quoteReply: en.quoteReply !== undefined ? en.quoteReply : song.quoteReply,
    quoteReplyAttribution:
      en.quoteReplyAttribution !== undefined
        ? en.quoteReplyAttribution
        : song.quoteReplyAttribution,
    caveat: en.caveat !== undefined ? en.caveat : song.caveat,
    historicalPhoto: merge(song.historicalPhoto, en.historicalPhoto),
    firstPerformance: merge(song.firstPerformance, en.firstPerformance),
    famousPerformance: merge(song.famousPerformance, en.famousPerformance),
    interviewVideo: merge(song.interviewVideo, en.interviewVideo),
    originalTitle: song.title,
  };
}

import fs from "fs";
import path from "path";

const SONGS_DIR = path.join(process.cwd(), "content", "songs");

export function getAllSongs() {
  const files = fs.readdirSync(SONGS_DIR).filter((f) => f.endsWith(".json"));
  const songs = files.map((file) => {
    const raw = fs.readFileSync(path.join(SONGS_DIR, file), "utf-8");
    return JSON.parse(raw);
  }).filter((s) => !s.hidden);
  // πρώτα τα άρθρα με ιστορία, μετά οι σελίδες στοιχείων (stubs)
  const rank = (s) => (s.isStub ? 2 : s.status === "verified" ? 0 : 1);
  return songs.sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title, "el"));
}

export function getSongBySlug(slug) {
  const filePath = path.join(SONGS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const song = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return song.hidden ? null : song;
}

export function getAllSlugs() {
  return getAllSongs().map((s) => s.slug);
}

// Επιστρέφει το τραγούδι με τα αγγλικά πεδία (song.en.*) να αντικαθιστούν τα
// ελληνικά, εκεί όπου υπάρχει μετάφραση — ονόματα προσώπων (συνθέτης,
// στιχουργός, ερμηνευτής) παραμένουν στα ελληνικά, όπως συνηθίζεται. Ο
// τίτλος του τραγουδιού ΔΕΝ μεταφράζεται ποτέ — μένει πάντα στο πρωτότυπο,
// γιατί μια μετάφραση τίτλου μπορεί εύκολα να βγει ανακριβής/λάθος.
export function localizeSong(song, lang) {
  if (!song || lang !== "en" || !song.en) return song;
  const en = song.en;
  const merge = (base, patch) => (base ? { ...base, ...(patch || {}) } : base);
  return {
    ...song,
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
    recording: merge(song.recording, en.recording),
    firstPerformance: merge(song.firstPerformance, en.firstPerformance),
    famousPerformance: merge(song.famousPerformance, en.famousPerformance),
    interviewVideo: merge(song.interviewVideo, en.interviewVideo),
    textSource: merge(song.textSource, en.textSource),
  };
}

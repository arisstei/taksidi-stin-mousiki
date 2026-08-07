"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const ALPHABET = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split("");

function normalize(str) {
  if (!str) return "";
  return str
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
}

export default function SongExplorer({ songs }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState(null);

  const availableLetters = useMemo(() => {
    const set = new Set(songs.map((s) => normalize(s.title).charAt(0)));
    return set;
  }, [songs]);

  const filtered = useMemo(() => {
    let list = songs;
    if (letter) {
      list = list.filter((s) => normalize(s.title).startsWith(letter));
    }
    if (query.trim()) {
      const q = normalize(query.trim());
      list = list.filter((s) =>
        [s.title, s.composer, s.lyricist, s.performer]
          .filter(Boolean)
          .some((field) => normalize(field).includes(q))
      );
    }
    return list;
  }, [songs, query, letter]);

  return (
    <div>
      <div className="max-w-xl mx-auto text-center mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Αναζήτησε τραγούδι, συνθέτη ή τραγουδιστή…"
          className="w-full rounded-full border border-black/15 px-5 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/40 bg-white shadow-sm"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 mb-10 max-w-2xl mx-auto">
        <button
          onClick={() => setLetter(null)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
            !letter ? "bg-brand text-white" : "bg-white/70 text-ink/60 hover:bg-white"
          }`}
        >
          Όλα
        </button>
        {ALPHABET.map((ch) => {
          const has = availableLetters.has(ch);
          return (
            <button
              key={ch}
              disabled={!has}
              onClick={() => setLetter(ch === letter ? null : ch)}
              className={`w-7 h-7 text-xs font-medium rounded-full transition-colors ${
                letter === ch
                  ? "bg-brand text-white"
                  : has
                  ? "bg-white/70 text-ink/70 hover:bg-white"
                  : "bg-transparent text-ink/20 cursor-not-allowed"
              }`}
            >
              {ch}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-ink/50 py-10">
          Δεν βρέθηκαν τραγούδια για αυτή την αναζήτηση.
        </p>
      ) : (
        <section className="space-y-6">
          {filtered.map((song) => (
            <Link
              key={song.slug}
              href={`/song/${song.slug}`}
              className="block group border border-black/10 rounded-lg p-5 bg-white/60 hover:bg-white hover:border-brand/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl text-ink group-hover:text-brand transition-colors">
                    {song.title}
                  </h2>
                  <p className="text-sm text-ink/60 mt-1">
                    {[song.composer, song.lyricist]
                      .filter((v, i, arr) => v && arr.indexOf(v) === i)
                      .join(" / ")}
                    {song.year ? ` · ${song.year}` : ""}
                    {song.performer ? ` · ${song.performer}` : ""}
                  </p>
                </div>
                <StatusBadge status={song.status} label={song.statusLabel} />
              </div>
              <p className="text-ink/70 mt-3 leading-relaxed">{song.teaser}</p>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}

function StatusBadge({ status, label }) {
  const isVerified = status === "verified";
  return (
    <span
      className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
        isVerified
          ? "bg-green-100 text-green-800"
          : "bg-amber-100 text-amber-800"
      }`}
      title={label}
    >
      {isVerified ? "✅ Τεκμηριωμένο" : "⚠️ Προς επιβεβαίωση"}
    </span>
  );
}

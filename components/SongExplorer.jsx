"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const ALPHABET = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split("");

const TABS = [
  { key: "composers", label: "Συνθέτες" },
  { key: "lyricists", label: "Στιχουργοί" },
  { key: "performers", label: "Ερμηνευτές" },
  { key: "titles", label: "Τραγούδια" },
];

function normalize(str) {
  if (!str) return "";
  return str
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
}

function uniqueNames(songs, fields) {
  const map = new Map();
  for (const song of songs) {
    for (const field of fields) {
      const value = song[field];
      if (!value) continue;
      const key = normalize(value);
      if (!map.has(key)) map.set(key, value);
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    normalize(a).localeCompare(normalize(b), "el")
  );
}

export default function SongExplorer({ songs }) {
  const [tab, setTab] = useState("titles");
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState(null);

  const composers = useMemo(() => uniqueNames(songs, ["composer"]), [songs]);
  const lyricists = useMemo(() => uniqueNames(songs, ["lyricist"]), [songs]);
  const performers = useMemo(() => uniqueNames(songs, ["performer"]), [songs]);

  const names =
    tab === "composers"
      ? composers
      : tab === "lyricists"
      ? lyricists
      : tab === "performers"
      ? performers
      : null;

  const availableLetters = useMemo(() => {
    const source = tab === "titles" ? songs.map((s) => s.title) : names || [];
    return new Set(source.map((s) => normalize(s).charAt(0)));
  }, [songs, names, tab]);

  const filteredSongs = useMemo(() => {
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

  const filteredNames = useMemo(() => {
    if (!names) return [];
    let list = names;
    if (letter) {
      list = list.filter((n) => normalize(n).startsWith(letter));
    }
    if (query.trim()) {
      const q = normalize(query.trim());
      list = list.filter((n) => normalize(n).includes(q));
    }
    return list;
  }, [names, letter, query]);

  function goToName(name) {
    setQuery(name);
    setLetter(null);
    setTab("titles");
  }

  function switchTab(key) {
    setTab(key);
    setLetter(null);
    setQuery("");
  }

  const searchPlaceholder =
    tab === "composers"
      ? "Αναζήτησε συνθέτη…"
      : tab === "lyricists"
      ? "Αναζήτησε στιχουργό…"
      : tab === "performers"
      ? "Αναζήτησε ερμηνευτή…"
      : "Αναζήτησε τραγούδι, συνθέτη ή τραγουδιστή…";

  const previewTitles = songs.slice(0, 4);
  const previewPerformers = performers.slice(0, 4);
  const previewComposers = composers.slice(0, 4);
  const previewLyricists = lyricists.slice(0, 4);

  return (
    <div>
      <div className="max-w-3xl mx-auto text-center mb-3">
        <p className="text-xs text-ink/45">
          Στη συλλογή: {songs.length} τραγούδια · {composers.length} συνθέτες ·{" "}
          {lyricists.length} στιχουργοί · {performers.length} ερμηνευτές
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-center text-xs font-semibold text-ink/40 uppercase tracking-wide mb-4">
          Μια πρώτη ματιά
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xs font-semibold text-brand uppercase tracking-wide mb-2">
              Συνθέτες
            </h3>
            <ul className="space-y-1.5">
              {previewComposers.map((name) => (
                <li key={name}>
                  <button
                    onClick={() => goToName(name)}
                    className="text-sm text-ink/70 hover:text-brand hover:underline text-left"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-brand uppercase tracking-wide mb-2">
              Στιχουργοί
            </h3>
            <ul className="space-y-1.5">
              {previewLyricists.map((name) => (
                <li key={name}>
                  <button
                    onClick={() => goToName(name)}
                    className="text-sm text-ink/70 hover:text-brand hover:underline text-left"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-brand uppercase tracking-wide mb-2">
              Ερμηνευτές
            </h3>
            <ul className="space-y-1.5">
              {previewPerformers.map((name) => (
                <li key={name}>
                  <button
                    onClick={() => goToName(name)}
                    className="text-sm text-ink/70 hover:text-brand hover:underline text-left"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-brand uppercase tracking-wide mb-2">
              Τίτλοι
            </h3>
            <ul className="space-y-1.5">
              {previewTitles.map((song) => (
                <li key={song.slug}>
                  <Link
                    href={`/song/${song.slug}`}
                    className="text-sm text-ink/70 hover:text-brand hover:underline"
                  >
                    {song.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-1 mb-6 max-w-lg mx-auto bg-white/60 border border-black/10 rounded-full p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => switchTab(t.key)}
            className={`flex-1 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
              tab === t.key
                ? "bg-brand text-white"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto text-center mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
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

      {tab !== "titles" ? (
        filteredNames.length === 0 ? (
          <p className="text-center text-ink/50 py-10">Δεν βρέθηκαν ονόματα.</p>
        ) : (
          <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-2">
            {filteredNames.map((name) => (
              <button
                key={name}
                onClick={() => goToName(name)}
                className="text-left px-4 py-3 rounded-lg border border-black/10 bg-white/60 hover:bg-white hover:border-brand/40 transition-colors text-ink"
              >
                {name}
              </button>
            ))}
          </div>
        )
      ) : filteredSongs.length === 0 ? (
        <p className="text-center text-ink/50 py-10">
          Δεν βρέθηκαν τραγούδια για αυτή την αναζήτηση.
        </p>
      ) : (
        <section className="space-y-6">
          {filteredSongs.map((song) => (
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

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSongThumbnail } from "@/lib/media";
import { GradeMini } from "@/components/GradeBadge";
import { getDictionary } from "@/lib/dictionaries";

const STORAGE_KEY = "song-explorer-state";

const ALPHABET = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const TAB_KEYS = ["composers", "lyricists", "performers", "titles"];

function normalize(str) {
  if (!str) return "";
  return str
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
}

// Αφαιρεί επεξηγηματικές παρενθέσεις (π.χ. "(μπουζούκι: ...)", "(πρώτη εκτέλεση, 1964)")
// — αυτές οι λεπτομέρειες παραμένουν μέσα στο άρθρο, όχι στις λίστες ονομάτων.
function stripAnnotations(str) {
  if (!str) return "";
  return str
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function uniqueNames(songs, fields) {
  const map = new Map();
  for (const song of songs) {
    for (const field of fields) {
      const raw = song[field];
      if (!raw) continue;
      const value = stripAnnotations(raw);
      if (!value) continue;
      const key = normalize(value);
      if (!map.has(key)) map.set(key, value);
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    normalize(a).localeCompare(normalize(b), "el")
  );
}

export default function SongExplorer({ songs, lang = "el" }) {
  const t = getDictionary(lang);
  const basePath = lang === "en" ? "/en" : "";

  const [tab, setTab] = useState("titles");
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState(null);
  const [restored, setRestored] = useState(false);

  // Επαναφορά της κατάστασης (tab/αναζήτηση/γράμμα) μετά από ανανέωση σελίδας,
  // ώστε το F5 να μη σε ξαναπετάει στα "Τραγούδια" χάνοντας αυτό που έψαχνες.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`${STORAGE_KEY}-${lang}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tab) setTab(parsed.tab);
        if (typeof parsed.query === "string") setQuery(parsed.query);
        if (parsed.letter) setLetter(parsed.letter);
      }
    } catch {
      // αγνόησε — απλώς ξεκινάμε από την προεπιλογή
    }
    setRestored(true);
  }, [lang]);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(
        `${STORAGE_KEY}-${lang}`,
        JSON.stringify({ tab, query, letter })
      );
    } catch {
      // αγνόησε (π.χ. private browsing χωρίς πρόσβαση σε storage)
    }
  }, [tab, query, letter, restored, lang]);

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
    // Άρθρα-προφίλ (π.χ. συνέντευξη, όχι ιστορία συγκεκριμένου τραγουδιού) δεν
    // εμφανίζονται στη γενική περιήγηση τίτλων — μόνο όταν κάποιος ψάχνει
    // ενεργά (π.χ. πατώντας το όνομα του/της δημιουργού).
    if (!query.trim()) {
      list = list.filter((s) => !s.isProfile);
    }
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

  const PREVIEW_COUNT = 5;
  const previewTitles = songs.filter((s) => !s.isProfile).slice(0, PREVIEW_COUNT);
  const previewPerformers = performers.slice(0, PREVIEW_COUNT);
  const previewComposers = composers.slice(0, PREVIEW_COUNT);
  const previewLyricists = lyricists.slice(0, PREVIEW_COUNT);
  const songCount = songs.filter((s) => !s.isProfile).length;

  const tabCounts = {
    composers: composers.length,
    lyricists: lyricists.length,
    performers: performers.length,
    titles: songCount,
  };

  const resultsCount = tab === "titles" ? filteredSongs.length : filteredNames.length;
  const resultsTotal = tab === "titles" ? songCount : (names || []).length;

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-2xl mx-auto">
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`font-mono text-[11px] font-semibold uppercase tracking-wide px-4 py-2 rounded-full border transition-colors ${
              tab === key
                ? "bg-brand text-white border-brand"
                : "bg-white/60 text-ink/60 border-black/15 hover:border-brand/40 hover:text-ink"
            }`}
          >
            {t.tabs[key]}{" "}
            <span className={tab === key ? "text-white/70" : "text-ink/35"}>
              ({tabCounts[key]})
            </span>
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto text-center mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder[tab]}
          className="w-full truncate rounded-full border border-black/15 px-5 py-3 text-sm sm:text-base text-ink placeholder:text-ink/40 placeholder:truncate focus:outline-none focus:ring-2 focus:ring-brand/40 bg-white shadow-sm"
        />
        <p className="mt-2 text-xs text-ink/40">{t.searchHint[tab]}</p>
      </div>

      <div className="max-w-3xl mx-auto text-center mb-3">
        <p className="text-xs text-ink/45">
          {t.statsLine(songCount, composers.length, lyricists.length, performers.length)}
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-center text-xs font-semibold text-ink/40 uppercase tracking-wide mb-4">
          {t.popularHeading}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xs font-semibold text-brand uppercase tracking-wide mb-2">
              {t.popularColumns.composers}
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
              {t.popularColumns.lyricists}
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
              {t.popularColumns.performers}
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
              {t.popularColumns.titles}
            </h3>
            <ul className="space-y-1.5">
              {previewTitles.map((song) => (
                <li key={song.slug}>
                  <Link
                    href={`${basePath}/song/${song.slug}`}
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

      <div className="flex flex-wrap justify-center gap-1.5 mb-10 max-w-2xl mx-auto">
        <button
          onClick={() => setLetter(null)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
            !letter ? "bg-brand text-white" : "bg-white/70 text-ink/60 hover:bg-white"
          }`}
        >
          {t.allLetters}
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

      <p className="text-center font-mono text-[11px] text-ink/40 uppercase tracking-wide mb-4">
        {t.resultsLine(resultsCount, resultsTotal)}
      </p>

      {tab !== "titles" ? (
        filteredNames.length === 0 ? (
          <p className="text-center text-ink/50 py-10">{t.noNames}</p>
        ) : (
          <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-2">
            {filteredNames.map((name) => (
              <button
                key={name}
                onClick={() => goToName(name)}
                className="text-left px-4 py-3 rounded-lg border border-black/10 bg-white/60 hover:bg-white hover:border-brand/40 hover:shadow-sm hover:-translate-y-0.5 transition-all text-ink"
              >
                {name}
              </button>
            ))}
          </div>
        )
      ) : filteredSongs.length === 0 ? (
        <p className="text-center text-ink/50 py-10">{t.noSongs}</p>
      ) : (
        <section className="max-w-2xl mx-auto space-y-2.5">
          {filteredSongs.map((song) => {
            const thumb = getSongThumbnail(song);
            return (
              <Link
                key={song.slug}
                href={`${basePath}/song/${song.slug}`}
                className="flex items-center gap-4 p-2.5 rounded-lg border border-transparent hover:border-black/10 hover:bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all group"
              >
                <div className="relative w-20 h-14 sm:w-24 sm:h-16 shrink-0 rounded-md overflow-hidden bg-brand-light flex items-center justify-center">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-brand/50 text-xl">♪</span>
                  )}
                  <span className="absolute bottom-1 right-1">
                    <GradeMini song={song} lang={lang} />
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-lg text-ink group-hover:text-brand transition-colors truncate">
                    {song.title}
                  </p>
                  <p className="text-sm text-ink/50 truncate">
                    {[song.composer, song.lyricist]
                      .filter((v, i, arr) => v && arr.indexOf(v) === i)
                      .join(" - ")}
                    {song.year ? ` · ${song.year}` : ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}

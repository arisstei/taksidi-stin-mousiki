"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function norm(s) {
  return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Όλα τα τραγούδια ενός στιχουργού, με φίλτρο συνθέτη και αναζήτηση.
export default function LyricistSongList({ sections, lang = "el" }) {
  const basePath = lang === "en" ? "/en" : "";
  const [composer, setComposer] = useState("");
  const [q, setQ] = useState("");

  const composers = useMemo(() => {
    const m = new Map();
    for (const s of sections) for (const x of s.songs) if (x.composer) m.set(x.composer, (m.get(x.composer) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [sections]);

  const filterSong = (x) =>
    (!composer || x.composer === composer) && (!q.trim() || norm(x.title).includes(norm(q.trim())));

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lang === "en" ? "Search a title…" : "Αναζήτησε τίτλο…"}
          className="flex-1 rounded-full border border-black/15 px-5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
        <select
          value={composer}
          onChange={(e) => setComposer(e.target.value)}
          className="rounded-full border border-black/15 px-4 py-2.5 text-sm bg-white"
        >
          <option value="">{lang === "en" ? "All composers" : "Όλοι οι συνθέτες"}</option>
          {composers.map(([c, n]) => (
            <option key={c} value={c}>
              {c} ({n})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-12">
        {sections.map((s) => {
          const list = s.songs.filter(filterSong);
          if (list.length === 0) return null;
          return (
            <section key={s.id}>
              <h3 className="section-kicker">
                {s.title} <span className="text-ink/35 normal-case tracking-normal">· {list.length}</span>
              </h3>
              {s.note && <p className="text-xs text-ink/55 -mt-2 mb-4 italic">{s.note}</p>}
              <ol className="label-card divide-y divide-black/5">
                {list.map((x) => (
                  <li key={x.archive} className="flex items-baseline gap-3 py-2.5">
                    <span className="font-mono text-[11px] text-ink/35 w-8 shrink-0 text-right">{x.n}</span>
                    <span className="flex-1 min-w-0">
                      {x.song ? (
                        <Link href={`${basePath}/song/${x.song}`} className="font-serif text-[16px] text-ink hover:text-brand">
                          {x.title}
                        </Link>
                      ) : (
                        <span className="font-serif text-[16px] text-ink/80">{x.title}</span>
                      )}
                      <span className="block text-xs text-ink/45 mt-0.5">
                        {[x.composer, x.year, x.record].filter(Boolean).join(" · ") ||
                          (lang === "en" ? "Composer: to be confirmed" : "Συνθέτης: προς επιβεβαίωση")}
                      </span>
                    </span>
                    {x.page && (
                      <span className="hidden sm:inline font-mono text-[10px] text-ink/40 shrink-0">
                        {lang === "en" ? "p." : "σ."} {x.page}
                      </span>
                    )}
                    <a
                      href={`https://gatsosarchive.org/song/${x.archive}/`}
                      target="_blank"
                      rel="noreferrer"
                      title={lang === "en" ? "Original text — Gatsos Archive" : "Πρωτότυπο κείμενο — Gatsos Archive"}
                      className="shrink-0 font-mono text-[10px] uppercase tracking-wide px-2 py-1 rounded border border-gold/50 text-gold hover:bg-gold hover:text-white transition-colors"
                    >
                      {lang === "en" ? "Text ↗" : "Κείμενο ↗"}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import RecordSleeve from "@/components/RecordSleeve";
import { getDiscDict } from "@/lib/discDict";

const KINDS = ["all", "cycle", "film", "theatre", "instrumental", "rebetiko", "anthology"];

// Το "ράφι" του δισκοπωλείου: δίσκοι ανά δεκαετία, με φίλτρο είδους.
export default function DiscographyShelf({ albums, composerName, lang = "el" }) {
  const t = getDiscDict(lang);
  const basePath = lang === "en" ? "/en" : "";
  const [kind, setKind] = useState("all");

  const available = useMemo(() => new Set(albums.map((a) => a.type)), [albums]);
  const filtered = kind === "all" ? albums : albums.filter((a) => a.type === kind);

  const byDecade = useMemo(() => {
    const m = new Map();
    for (const a of filtered) {
      const d = Math.floor((Number(a.year) || 0) / 10) * 10;
      if (!m.has(d)) m.set(d, []);
      m.get(d).push(a);
    }
    return [...m.entries()].sort((x, y) => x[0] - y[0]);
  }, [filtered]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {KINDS.filter((k) => k === "all" || available.has(k)).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`font-mono text-[11px] font-semibold uppercase tracking-wide px-3.5 py-1.5 rounded-full border transition-colors ${
              kind === k
                ? "bg-ink text-cream border-ink"
                : "bg-white/60 text-ink/60 border-black/15 hover:border-ink/40 hover:text-ink"
            }`}
          >
            {t.kinds[k]}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {byDecade.map(([decade, list]) => (
          <section key={decade}>
            <div className="flex items-baseline gap-3 mb-5">
              <h3 className="font-serif text-2xl text-ink">{t.decade(decade)}</h3>
              <span className="flex-1 h-px bg-black/10" />
              <span className="font-mono text-[11px] text-ink/40">{list.length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-8">
              {list.map((a) => {
                const stories = (a.tracks || []).filter((x) => x.song).length;
                return (
                  <Link key={a.slug} href={`${basePath}/album/${a.slug}`} className="group block">
                    <div className="pr-[12%]">
                      <RecordSleeve album={a} composerName={composerName} />
                    </div>
                    <p className="mt-3 font-serif text-[15px] leading-snug text-ink group-hover:text-brand transition-colors">
                      {a.title}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink/45 mt-1">
                      {a.year}
                      {a.labelShort ? ` · ${a.labelShort}` : ""}
                      {stories ? ` · ${t.songsWithStory(stories)}` : ""}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

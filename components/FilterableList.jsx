"use client";

import { useMemo, useState } from "react";
import { getDiscDict } from "@/lib/discDict";

const ALPHABET = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function normalize(str) {
  if (!str) return "";
  return str.toString().normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
}

// Αναζήτηση + αλφαβητικό φίλτρο πάνω σε έτοιμες (server-rendered) κάρτες.
// items: [{ id, name, node }]. Όλες οι κάρτες υπάρχουν στο HTML· οι μη
// ταιριαστές απλώς κρύβονται (hidden) client-side.
export default function FilterableList({ items, lang = "el", className = "" }) {
  const t = getDiscDict(lang);
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState(null);

  const prepared = useMemo(
    () => items.map((it) => ({ ...it, norm: normalize(it.name) })),
    [items]
  );
  const available = useMemo(() => new Set(prepared.map((p) => p.norm.charAt(0))), [prepared]);

  const q = normalize(query.trim());
  const words = q.split(/\s+/).filter(Boolean);
  const visible = prepared.map((p) => {
    if (letter && !p.norm.startsWith(letter)) return false;
    // κάθε λέξη της αναζήτησης πρέπει να υπάρχει σε κάποια λέξη του ονόματος
    return words.every((w) => p.norm.includes(w));
  });
  const count = visible.filter(Boolean).length;
  const active = !!(q || letter);
  const clear = () => {
    setQuery("");
    setLetter(null);
  };

  return (
    <div>
      <div className="max-w-xl mb-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchLabel}
          className="w-full truncate rounded-full border border-black/15 px-5 py-3 text-sm sm:text-base text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/40 bg-white shadow-sm"
        />
      </div>

      <div role="group" aria-label={t.lettersLabel} className="flex flex-wrap gap-1.5 mb-4">
        <button
          type="button"
          onClick={() => setLetter(null)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
            !letter ? "bg-brand text-white" : "bg-white/70 text-ink/60 hover:bg-white"
          }`}
        >
          {t.allLetters}
        </button>
        {ALPHABET.map((ch) => {
          const has = available.has(ch);
          return (
            <button
              key={ch}
              type="button"
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

      <p className="font-mono text-[11px] text-ink/40 uppercase tracking-wide mb-8" aria-live="polite">
        {t.resultsCount(count, items.length)}
        {active && (
          <button type="button" onClick={clear} className="ml-3 text-brand hover:underline uppercase">
            {t.clearFilters}
          </button>
        )}
      </p>

      {count === 0 && <p className="text-ink/50 py-10">{t.noResults}</p>}
      <div className={className}>
        {prepared.map((p, i) => (
          <div key={p.id} hidden={!visible[i]}>
            {p.node}
          </div>
        ))}
      </div>
    </div>
  );
}

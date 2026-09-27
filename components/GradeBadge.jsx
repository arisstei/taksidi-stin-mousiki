import { GRADES } from "@/lib/grades";
import { getDictionary } from "@/lib/dictionaries";

function resolve(song, lang) {
  const key = GRADES[song?.grade] ? song.grade : "C";
  const base = GRADES[key];
  const text = getDictionary(lang).grades[key] || {};
  return { key, ...base, ...text, code: base.code };
}

function Stars({ n, className = "" }) {
  if (!n) return null;
  return (
    <span aria-hidden="true" className={`tracking-[-0.1em] ${className}`}>
      {"★".repeat(n)}
    </span>
  );
}

// Πλήρες badge (κωδικός + τίτλος + %) — για τη σελίδα τραγουδιού/δίσκου.
export function GradeBadge({ song, lang = "el" }) {
  const g = resolve(song, lang);
  return (
    <span
      title={g.description}
      className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded border ${g.badgeClass}`}
    >
      <span className="font-mono font-bold text-[13px] leading-none">{g.code}</span>
      <Stars n={g.stars} className="text-[11px]" />
      <span>{g.title}</span>
      {g.percent && <span className="font-mono opacity-80">· {g.percent}</span>}
    </span>
  );
}

// Μικρό badge (μόνο κωδικός) — για κάρτες λίστας / thumbnails.
export function GradeMini({ song, lang = "el" }) {
  const g = resolve(song, lang);
  const isS = g.key.startsWith("S");
  return (
    <span
      title={`${g.code} — ${g.title}${g.percent ? ` (${g.percent})` : ""}`}
      className={`inline-flex items-center justify-center h-5 min-w-5 px-1 shrink-0 text-[10px] font-mono font-bold rounded border ${
        isS ? g.badgeClass : `bg-white/90 ${g.outlineClass}`
      }`}
    >
      {g.code}
    </span>
  );
}

export default GradeBadge;

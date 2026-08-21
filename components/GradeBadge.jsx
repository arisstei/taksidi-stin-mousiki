import { GRADES } from "@/lib/grades";
import { getDictionary } from "@/lib/dictionaries";

function resolve(song, lang) {
  const key = GRADES[song?.grade] ? song.grade : "C";
  const base = GRADES[key];
  const text = getDictionary(lang).grades[key] || base;
  return { ...base, ...text };
}

// Πλήρες badge (κωδικός + τίτλος) — για τη σελίδα τραγουδιού.
export function GradeBadge({ song, lang = "el" }) {
  const g = resolve(song, lang);
  return (
    <span
      title={g.description}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded border ${g.badgeClass}`}
    >
      <span className="font-serif text-sm leading-none">{g.code}</span>
      <span>{g.title}</span>
    </span>
  );
}

// Μικρό badge (μόνο κωδικός) — για κάρτες λίστας / thumbnails.
export function GradeMini({ song, lang = "el" }) {
  const g = resolve(song, lang);
  return (
    <span
      title={`${g.title} — ${g.description}`}
      className={`inline-flex items-center justify-center w-5 h-5 shrink-0 text-[11px] font-serif font-bold rounded border bg-white/90 ${g.outlineClass}`}
    >
      {g.code}
    </span>
  );
}

export default GradeBadge;

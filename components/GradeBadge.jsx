import { getGrade } from "@/lib/grades";

// Πλήρες badge (κωδικός + τίτλος) — για τη σελίδα τραγουδιού.
export function GradeBadge({ song }) {
  const g = getGrade(song);
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
export function GradeMini({ song }) {
  const g = getGrade(song);
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

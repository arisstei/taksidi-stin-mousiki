import { getDictionary } from "@/lib/dictionaries";
import { GRADES } from "@/lib/grades";

const GRADE_ORDER = ["A", "B", "C", "D"];

export default function AboutContent({ lang = "el" }) {
  const dict = getDictionary(lang);
  const t = dict.about;
  const gradeText = dict.grades;

  return (
    <article className="prose-like space-y-8">
      <header>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink leading-tight">
          {t.title} <span className="text-brand">{t.titleHighlight}</span>
        </h1>
      </header>

      <section className="space-y-4">
        <h2 className="font-serif text-xl text-ink">{t.s1h}</h2>
        <p className="text-ink/80 leading-relaxed">{t.s1p}</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-xl text-ink">{t.s2h}</h2>
        <p className="text-ink/80 leading-relaxed">{t.s2p1a}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GRADE_ORDER.map((key) => {
            const g = GRADES[key];
            const text = gradeText[key];
            return (
              <div
                key={key}
                className={`rounded-lg p-4 shadow-sm ${g.badgeClass}`}
              >
                <p className="font-serif text-3xl font-bold leading-none">
                  {g.code}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wide mt-2 text-white/95">
                  {text.title}
                </p>
                <p className="text-[11px] leading-snug mt-1.5 text-white/75">
                  {text.description}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-ink/60 text-sm">{t.s2p1c}</p>

        <p className="text-ink/80 leading-relaxed">{t.s2p2}</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-xl text-ink">{t.s3h}</h2>
        <p className="text-ink/60 leading-relaxed italic">{t.s3p}</p>
      </section>
    </article>
  );
}

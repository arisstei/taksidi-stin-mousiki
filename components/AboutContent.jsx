import { getDictionary } from "@/lib/dictionaries";
import { GRADES, GRADE_ORDER } from "@/lib/grades";

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

        {/* Κλίμακα: από το υψηλότερο (SSS) στο χαμηλότερο (D) */}
        <div className="grid gap-2.5">
          {GRADE_ORDER.map((key) => {
            const g = GRADES[key];
            const text = gradeText[key];
            const top = key.startsWith("S");
            return (
              <div
                key={key}
                className={`flex items-stretch rounded-lg overflow-hidden border shadow-sm ${g.badgeClass}`}
              >
                <div className="w-20 sm:w-24 shrink-0 flex flex-col items-center justify-center py-3 border-r border-black/15">
                  <span className="font-mono text-2xl sm:text-3xl font-bold leading-none">{g.code}</span>
                  {g.stars ? (
                    <span className="text-[11px] mt-1 tracking-[-0.1em]">{"★".repeat(g.stars)}</span>
                  ) : null}
                  {g.percent && (
                    <span className="font-mono text-[10px] mt-1 opacity-85">{g.percent}</span>
                  )}
                </div>
                <div className="px-4 py-3">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${top ? "" : "text-white/95"}`}>
                    {text.title}
                  </p>
                  <p className={`text-[13px] leading-snug mt-1 ${top ? "opacity-90" : "text-white/80"}`}>
                    {text.description}
                  </p>
                </div>
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

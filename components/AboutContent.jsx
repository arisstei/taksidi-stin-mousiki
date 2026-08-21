import { getDictionary } from "@/lib/dictionaries";

export default function AboutContent({ lang = "el" }) {
  const t = getDictionary(lang).about;
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
        <p className="text-ink/80 leading-relaxed">
          {t.s2p1a} <span className="text-amber-800">{t.s2p1b}</span> {t.s2p1c}
        </p>
        <p className="text-ink/80 leading-relaxed">{t.s2p2}</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-xl text-ink">{t.s3h}</h2>
        <p className="text-ink/60 leading-relaxed italic">{t.s3p}</p>
      </section>
    </article>
  );
}

import { getAllComposers, getAlbumsByComposer, localizeComposer } from "@/lib/albums";
import { getDiscDict } from "@/lib/discDict";
import { SITE_URL } from "@/lib/site";
import ComposersIndex from "@/components/ComposersIndex";

const LANG = "el";

export const metadata = {
  title: getDiscDict(LANG).discographies,
  description: getDiscDict(LANG).discographiesIntro,
  alternates: { canonical: `${SITE_URL}/composers`, languages: { el: `${SITE_URL}/composers`, en: `${SITE_URL}/en/composers` } },
};

export default function ComposersPage() {
  const t = getDiscDict(LANG);
  const composers = getAllComposers().map((c) => ({
    ...localizeComposer(c, LANG),
    albums: getAlbumsByComposer(c.slug).map((a) => ({ slug: a.slug, title: a.title, year: a.year, type: a.type, label: a.label })),
  }));
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold mb-3">{t.discographiesKicker}</p>
      <h1 className="font-serif font-bold uppercase tracking-tight text-4xl sm:text-5xl text-ink">{t.discographies}</h1>
      <p className="text-ink/70 mt-4 mb-12 max-w-2xl leading-relaxed">{t.discographiesIntro}</p>
      <ComposersIndex composers={composers} lang={LANG} />
    </div>
  );
}

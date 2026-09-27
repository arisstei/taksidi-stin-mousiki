import { getAllLyricists, localizeLyricist } from "@/lib/lyricists";
import { getAllComposers, getAlbumsByComposer, localizeComposer } from "@/lib/albums";
import { getDiscDict } from "@/lib/discDict";
import { SITE_URL } from "@/lib/site";
import ComposersIndex from "@/components/ComposersIndex";

const LANG = "en";

export const metadata = {
  title: { absolute: `${getDiscDict(LANG).discographies} — A Journey Through Music` },
  description: getDiscDict(LANG).discographiesIntro,
  alternates: { canonical: `${SITE_URL}/en/composers`, languages: { el: `${SITE_URL}/composers`, en: `${SITE_URL}/en/composers` } },
};

function lyricistCards(lang) {
  const basePath = lang === "en" ? "/en" : "";
  return getAllLyricists().map((l) => {
    const L = localizeLyricist(l, lang);
    const recorded = (l.sections || []).find((s) => s.id === "recorded")?.songs || [];
    return {
      slug: l.slug, name: l.name, born: l.born, died: l.died, fileNo: l.fileNo,
      href: `${basePath}/lyricist/${l.slug}`,
      role: lang === "en" ? "Poet · Lyricist" : "Ποιητής · Στιχουργός",
      countLabel: lang === "en" ? `${recorded.length} recorded songs` : `${recorded.length} δισκογραφημένα τραγούδια`,
      sampleTitles: recorded.slice(1, 9).map((x) => x.title.replace(/\s*\([^)]*\)$/, "")),
      albums: [],
      tagline: L.tagline,
    };
  });
}

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
      <ComposersIndex composers={[...composers, ...lyricistCards(LANG)]} lang={LANG} />
    </div>
  );
}

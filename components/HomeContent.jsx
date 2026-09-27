import { getAllLyricists, localizeLyricist } from "@/lib/lyricists";
import Link from "next/link";
import { localizeSong } from "@/lib/songs";
import { getSongThumbnail } from "@/lib/media";
import { GradeBadge } from "@/components/GradeBadge";
import DiamondDivider from "@/components/DiamondDivider";
import SongExplorer from "@/components/SongExplorer";
import RandomSongButton from "@/components/RandomSongButton";
import { getDictionary } from "@/lib/dictionaries";
import { getAllComposers, getAlbumsByComposer, localizeComposer, getAllAlbums } from "@/lib/albums";
import { getDiscDict } from "@/lib/discDict";
import ComposersIndex from "@/components/ComposersIndex";

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

export default function HomeContent({ songs: rawSongs, lang = "el" }) {
  const t = getDictionary(lang);
  const basePath = lang === "en" ? "/en" : "";
  // πρώτος δίσκος (χρονολογικά) κάθε τραγουδιού — για τη μικρογραφία όσων δεν έχουν βίντεο
  const firstAlbum = {};
  for (const a of getAllAlbums()) {
    for (const t of a.tracks || []) {
      if (t.song && !firstAlbum[t.song]) firstAlbum[t.song] = { slug: a.slug, title: a.title, year: a.year };
    }
  }
  const songs = rawSongs.map((s) => ({ ...localizeSong(s, lang), albumSleeve: firstAlbum[s.slug] || null }));

  const realSongs = songs.filter((s) => !s.isProfile && !s.isStub);
  const allSlugs = realSongs.map((s) => s.slug);

  const featured =
    realSongs.find((s) => s.slug === "mera-magiou" && s.quote) ||
    realSongs.find((s) => s.status === "verified" && s.quote) ||
    realSongs[0];
  const featuredThumb = featured ? getSongThumbnail(featured) : null;
  const dt = getDiscDict(lang);
  const composers = getAllComposers().map((c) => ({
    ...localizeComposer(c, lang),
    albums: getAlbumsByComposer(c.slug).map((a) => ({ slug: a.slug, title: a.title, year: a.year, type: a.type, label: a.label })),
  }));

  return (
    <div>
      <section className="bg-dotted -mx-4 px-4 py-10 sm:py-14 mb-14 rounded-2xl">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-[11px] font-semibold text-brand uppercase tracking-[0.3em] mb-4">
            {t.hero.kicker}
          </p>
          <h1 className="font-serif font-bold uppercase tracking-tight text-4xl sm:text-5xl leading-tight text-ink mb-5">
            {t.hero.titleParts[0]}
            <span className="text-brand">{t.hero.titleParts[1]}</span>
            {t.hero.titleParts[2]}
          </h1>
          <DiamondDivider className="mb-5" />
          <p className="text-ink/70 leading-relaxed text-lg">{t.hero.subtitle}</p>
          <div className="mt-7">
            <RandomSongButton slugs={allSlugs} basePath={basePath} label={t.hero.randomButton} />
          </div>
        </div>
      </section>

      {featured && (
        <section className="mb-14 max-w-3xl mx-auto">
          <p className="text-center font-mono text-[11px] font-semibold text-gold uppercase tracking-[0.25em] mb-3">
            {t.featured.kicker}
          </p>
          <Link
            href={`${basePath}/song/${featured.slug}`}
            className="torn-bottom group relative flex flex-col sm:flex-row items-stretch gap-0 border border-black/10 -rotate-[0.5deg] hover:rotate-0 bg-white/70 hover:bg-white hover:border-gold/60 hover:shadow-md transition-all duration-300"
          >
            <span
              aria-hidden="true"
              className="washi-tape left-8 -rotate-[4deg]"
            />
            <div className="absolute top-3 right-3 z-10">
              <GradeBadge song={featured} lang={lang} />
            </div>
            <div className="sm:w-56 shrink-0 bg-brand-light flex items-center justify-center overflow-hidden">
              {featuredThumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredThumb}
                  alt=""
                  className="w-full h-full object-cover aspect-video sm:aspect-auto"
                  loading="lazy"
                />
              ) : (
                <span className="text-brand/50 text-3xl py-10">♪</span>
              )}
            </div>
            <div className="p-6 sm:p-8 flex-1">
              <p className="font-serif text-xl sm:text-2xl text-ink leading-snug italic">
                «{featured.quote}»
              </p>
              <p className="text-sm text-ink/50 mt-3">
                {featured.quoteAttribution} {t.featured.from}{" "}
                <span className="text-brand group-hover:underline">{featured.title}</span>
              </p>
            </div>
          </Link>
        </section>
      )}

      {composers.length > 0 && (
        <section id="discographies" className="mb-16 max-w-3xl mx-auto scroll-mt-24">
          <div className="text-center mb-8">
            <p className="font-mono text-[11px] font-semibold text-gold uppercase tracking-[0.25em] mb-3">
              {dt.discographiesKicker}
            </p>
            <h2 className="font-serif font-bold uppercase tracking-tight text-3xl text-ink">{dt.discographies}</h2>
            <p className="text-ink/65 mt-3 max-w-xl mx-auto leading-relaxed">{dt.discographiesIntro}</p>
          </div>
          <ComposersIndex composers={[...composers, ...lyricistCards(lang)]} lang={lang} compact />
        </section>
      )}

      <SongExplorer songs={songs} lang={lang} />
    </div>
  );
}

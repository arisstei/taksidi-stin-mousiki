import Link from "next/link";
import { localizeSong } from "@/lib/songs";
import { getSongThumbnail } from "@/lib/media";
import { GradeBadge } from "@/components/GradeBadge";
import DiamondDivider from "@/components/DiamondDivider";
import SongExplorer from "@/components/SongExplorer";
import RandomSongButton from "@/components/RandomSongButton";
import { getDictionary } from "@/lib/dictionaries";

export default function HomeContent({ songs: rawSongs, lang = "el" }) {
  const t = getDictionary(lang);
  const basePath = lang === "en" ? "/en" : "";
  const songs = rawSongs.map((s) => localizeSong(s, lang));

  const realSongs = songs.filter((s) => !s.isProfile);
  const allSlugs = realSongs.map((s) => s.slug);

  const featured =
    realSongs.find((s) => s.slug === "mera-magiou" && s.quote) ||
    realSongs.find((s) => s.status === "verified" && s.quote) ||
    realSongs[0];
  const featuredThumb = featured ? getSongThumbnail(featured) : null;

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
            className="group relative flex flex-col sm:flex-row items-stretch gap-0 border border-black/10 rounded-xl overflow-hidden bg-white/70 hover:bg-white hover:border-gold/60 hover:shadow-md transition-all"
          >
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

      <SongExplorer songs={songs} lang={lang} />
    </div>
  );
}

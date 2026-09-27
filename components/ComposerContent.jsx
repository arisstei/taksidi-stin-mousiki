import Link from "next/link";
import ArchiveVideo from "@/components/ArchiveVideo";
import DiscographyShelf from "@/components/DiscographyShelf";
import DiamondDivider from "@/components/DiamondDivider";
import { getDiscDict } from "@/lib/discDict";

export default function ComposerContent({ composer, albums, lang = "el" }) {
  const t = getDiscDict(lang);
  const basePath = lang === "en" ? "/en" : "";
  const storyCount = albums.reduce(
    (n, a) => n + (a.tracks || []).filter((x) => x.song).length,
    0
  );
  const shelfAlbums = albums.map((a) => ({
    slug: a.slug,
    title: a.title,
    year: a.year,
    type: a.type,
    label: a.label,
    labelShort: (a.label || "").split(/[;,]/)[0].trim(),
    tracks: (a.tracks || []).map((x) => ({ song: x.song || null })),
  }));

  return (
    <article>
      <Link href={`${basePath}/`} className="text-sm text-brand hover:underline">
        {lang === "en" ? "← Home" : "← Αρχική"}
      </Link>

      {/* Φάκελος αρχείου */}
      <header className="archive-folder mt-6">
        <span className="folder-tab font-mono text-[10px] uppercase tracking-[0.25em]">
          {lang === "en" ? "File" : "Φάκελος"} № {composer.fileNo || "001"} · {composer.name}
        </span>
        <div className="relative p-6 sm:p-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold mb-3">
            {t.composer} · {composer.lifespan}
          </p>
          <h1 className="font-serif font-bold uppercase tracking-tight text-4xl sm:text-6xl text-ink leading-[0.95]">
            {composer.name}
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-ink/70 mt-4 max-w-2xl">
            {composer.tagline}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-6 font-mono text-[11px] uppercase tracking-wider text-ink/50">
            <span>{t.albumsCount(albums.length)}</span>
            {storyCount > 0 && <span>{t.songsWithStory(storyCount)}</span>}
            {composer.interviews?.length > 0 && (
              <span>
                {composer.interviews.length} {lang === "en" ? "archive videos" : "βίντεο αρχείου"}
              </span>
            )}
          </div>
          <span aria-hidden="true" className="stamp absolute top-6 right-6 hidden sm:flex">
            {lang === "en" ? "Archive" : "Αρχείο"}
            <br />
            {composer.born?.slice(0, 4)}–{composer.died?.slice(0, 4)}
          </span>
        </div>
      </header>

      <section className="mt-10 space-y-4">
        {(composer.bio || []).map((p, i) => (
          <p key={i} className={`text-ink/85 leading-relaxed ${i === 0 ? "dropcap" : ""}`}>
            {p}
          </p>
        ))}
      </section>

      {composer.interviews?.length > 0 && (
        <section className="mt-14">
          <h2 className="section-kicker">{t.interviewsHeading}</h2>
          <p className="text-sm text-ink/60 mb-6 -mt-2">{t.interviewsIntro}</p>
          <div className="grid gap-6">
            {composer.interviews.map((v, i) => (
              <ArchiveVideo key={i} video={v} lang={lang} />
            ))}
          </div>
        </section>
      )}

      <DiamondDivider className="my-14" />

      <section>
        <h2 className="font-serif text-3xl text-ink mb-2">{t.discographyHeading}</h2>
        <p className="text-sm text-ink/55 mb-6">{t.sleeveNote}</p>
        <DiscographyShelf albums={shelfAlbums} composerName={composer.name} lang={lang} />
      </section>

      <section className="mt-14 pt-6 border-t border-black/10">
        <h2 className="font-serif text-lg text-ink mb-3">{t.sourcesHeading}</h2>
        <ul className="space-y-2">
          {(composer.sources || []).map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="text-brand hover:underline text-sm">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

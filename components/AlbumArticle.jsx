import Link from "next/link";
import RecordSleeve, { Vinyl } from "@/components/RecordSleeve";
import ArchiveVideo from "@/components/ArchiveVideo";
import { GradeBadge } from "@/components/GradeBadge";
import DiamondDivider from "@/components/DiamondDivider";
import { getDiscDict } from "@/lib/discDict";
import { sleeveFor } from "@/lib/sleeves";

function sideOf(pos) {
  const p = String(pos || "").trim().toUpperCase();
  if (/^[BΒ]/.test(p)) return "B";
  if (/^[AΑ]/.test(p)) return "A";
  return null;
}

function TrackRow({ track, basePath, t }) {
  const hasLink = Boolean(track.song);
  const hasStory = hasLink && !track.stub;
  const inner = (
    <>
      <span className="font-mono text-[11px] text-ink/40 w-8 shrink-0 pt-1">{track.pos}</span>
      <span className="flex-1 min-w-0">
        <span
          className={`font-serif text-[17px] leading-snug ${
            hasStory ? "text-ink group-hover:text-brand" : hasLink ? "text-ink/85 group-hover:text-brand" : "text-ink/60"
          }`}
        >
          {track.title}
        </span>
        {(track.performer || track.lyricist || track.orig) && (
          <span className="block text-xs text-ink/45 mt-0.5">
            {[
              track.performer,
              track.lyricist ? `${t.lyrAbbr} ${track.lyricist}` : null,
              track.orig ? `${t.origAbbr} ${track.orig}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        )}
      </span>
      {hasStory && (
        <span className="shrink-0 self-center font-mono text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-brand text-white group-hover:bg-brand-dark transition-colors">
          {t.storyBadge}
        </span>
      )}
    </>
  );
  return hasLink ? (
    <li>
      <Link
        href={`${basePath}/song/${track.song}`}
        className="group flex gap-3 py-2.5 px-2 -mx-2 rounded hover:bg-gold-light/60 transition-colors"
      >
        {inner}
      </Link>
    </li>
  ) : (
    <li className="flex gap-3 py-2.5 px-2 -mx-2">{inner}</li>
  );
}

export default function AlbumArticle({ album, composer, prev, next, lang = "el" }) {
  const t = getDiscDict(lang);
  const basePath = lang === "en" ? "/en" : "";
  const s = sleeveFor(album.slug);
  const tracks = album.tracks || [];
  const sideA = tracks.filter((x) => sideOf(x.pos) !== "B");
  const sideB = tracks.filter((x) => sideOf(x.pos) === "B");
  const hasSides = sideB.length > 0 && sideA.every((x) => sideOf(x.pos) === "A");
  const discogsUrl = (album.sources || []).find((x) => x.url.includes("discogs.com/master"))?.url;
  const withStory = tracks.filter((x) => x.song && !x.stub).length;

  return (
    <article>
      <Link
        href={`${basePath}/composer/${composer.slug}`}
        className="text-sm text-brand hover:underline"
      >
        {t.backToComposer(composer.name)}
      </Link>

      <header className="mt-6 grid sm:grid-cols-[minmax(0,15rem)_1fr] gap-8 items-start">
        <div className="group max-w-[15rem] w-full mx-auto sm:mx-0">
          <RecordSleeve album={album} size="lg" composerName={composer.name} />
          {discogsUrl && (
            <a
              href={discogsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase tracking-wide px-3 py-2 rounded-full border border-gold/60 text-gold hover:bg-gold hover:text-white transition-colors"
            >
              {t.originalCover} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold mb-2">
            {album.kind} · {album.year}
          </p>
          <h1 className="font-serif font-bold uppercase tracking-tight text-3xl sm:text-4xl text-ink leading-[1.05]">
            {album.title}
          </h1>
          <p className="text-ink/60 mt-2">{composer.name}</p>

          <dl className="catalog-card mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            {album.label && (
              <>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45 pt-0.5">{t.label}</dt>
                <dd className="text-ink/80">{album.label}</dd>
              </>
            )}
            {album.catalog && (
              <>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45 pt-0.5">{t.catalog}</dt>
                <dd className="font-mono text-ink/80">{album.catalog}</dd>
              </>
            )}
            {album.performers?.length > 0 && (
              <>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45 pt-0.5">{t.performers}</dt>
                <dd className="text-ink/80">{album.performers.join(", ")}</dd>
              </>
            )}
            {album.lyricists?.length > 0 && (
              <>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45 pt-0.5">{t.lyricists}</dt>
                <dd className="text-ink/80">{album.lyricists.join(", ")}</dd>
              </>
            )}
          </dl>
          <div className="mt-4">
            <GradeBadge song={album} lang={lang} />
          </div>
        </div>
      </header>

      <DiamondDivider className="my-10" />

      {album.about?.length > 0 && (
        <section className="mb-12">
          <h2 className="section-kicker">{t.aboutAlbum}</h2>
          <div className="space-y-4">
            {album.about.map((p, i) => (
              <p key={i} className={`text-ink/85 leading-relaxed ${i === 0 ? "dropcap" : ""}`}>
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {tracks.length > 0 && (
        <section className="mb-12">
          <h2 className="section-kicker">
            {t.tracklist}{" "}
            <span className="text-ink/35 normal-case tracking-normal">
              · {t.tracks(tracks.length)}
              {withStory ? ` · ${t.songsWithStory(withStory)}` : ""}
            </span>
          </h2>

          <div className="label-card relative overflow-hidden">
            <Vinyl
              color={s.label}
              className="hidden sm:block absolute -right-24 top-1/2 -translate-y-1/2 w-56 h-56 opacity-90"
            />
            <div className="relative sm:pr-36">
              {hasSides ? (
                <div className="grid gap-6">
                  <div>
                    <p className="side-label">{t.sideA}</p>
                    <ol className="divide-y divide-black/5">
                      {sideA.map((tr, i) => (
                        <TrackRow key={`a${i}`} track={tr} basePath={basePath} t={t} />
                      ))}
                    </ol>
                  </div>
                  <div>
                    <p className="side-label">{t.sideB}</p>
                    <ol className="divide-y divide-black/5">
                      {sideB.map((tr, i) => (
                        <TrackRow key={`b${i}`} track={tr} basePath={basePath} t={t} />
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <ol className="divide-y divide-black/5">
                  {tracks.map((tr, i) => (
                    <TrackRow key={i} track={tr} basePath={basePath} t={t} />
                  ))}
                </ol>
              )}
            </div>
          </div>
          {tracks.some((x) => !x.song || x.stub) && (
            <p className="text-xs text-ink/45 mt-3 italic">{t.noStoryNote}</p>
          )}
        </section>
      )}

      {album.interviewVideo && (
        <section className="mb-12">
          <h2 className="section-kicker">{t.documentHeading}</h2>
          <ArchiveVideo video={album.interviewVideo} lang={lang} />
        </section>
      )}

      <section className="mt-12 pt-6 border-t border-black/10">
        <h2 className="font-serif text-lg text-ink mb-3">{t.sourcesHeading}</h2>
        <ul className="space-y-2">
          {(album.sources || []).map((src) => (
            <li key={src.url}>
              <a href={src.url} target="_blank" rel="noreferrer" className="text-brand hover:underline text-sm">
                {src.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-ink/40 mt-4 italic">{t.sleeveNote}</p>
      </section>

      <nav className="mt-12 grid grid-cols-2 gap-4 text-sm">
        <div>
          {prev && (
            <Link href={`${basePath}/album/${prev.slug}`} className="group block">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink/40">{t.prev}</span>
              <span className="block font-serif text-ink group-hover:text-brand">{prev.title}</span>
            </Link>
          )}
        </div>
        <div className="text-right">
          {next && (
            <Link href={`${basePath}/album/${next.slug}`} className="group block">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink/40">{t.next}</span>
              <span className="block font-serif text-ink group-hover:text-brand">{next.title}</span>
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}

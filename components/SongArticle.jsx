import Link from "next/link";
import { GradeBadge } from "@/components/GradeBadge";
import DiamondDivider from "@/components/DiamondDivider";
import { getDictionary } from "@/lib/dictionaries";

function toEmbedUrl(url) {
  if (!url) return null;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  const id = (watchMatch && watchMatch[1]) || (shortMatch && shortMatch[1]);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

function VideoEmbed({ url, label }) {
  const embedUrl = toEmbedUrl(url);
  if (!embedUrl) return null;
  return (
    <div className="mt-3">
      <div className="aspect-video rounded-lg overflow-hidden border border-black/10 bg-black/5">
        <iframe
          src={embedUrl}
          title={label || "YouTube video"}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {label && <p className="text-xs text-ink/50 mt-1.5">{label}</p>}
    </div>
  );
}

function PerformanceCard({ heading, performance, t }) {
  if (!performance) return null;
  const { performer, year, note, videoUrl, videoLabel, sourceLabel, sourceUrl } =
    performance;
  return (
    <div className="border border-black/10 rounded-lg p-4 bg-white/60">
      <h3 className="text-sm font-medium text-ink/50 uppercase tracking-wide mb-1.5">
        {heading}
      </h3>
      {performer && (
        <p className="text-ink font-medium">
          {performer}
          {year ? <span className="text-ink/50 font-normal"> · {year}</span> : ""}
        </p>
      )}
      {note && <p className="text-ink/70 text-sm mt-1.5 leading-relaxed">{note}</p>}
      <VideoEmbed url={videoUrl} label={videoLabel} />
      {!videoUrl && sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-2 text-xs text-brand hover:underline"
        >
          {t.sourceLabel} {sourceLabel || sourceUrl} →
        </a>
      )}
    </div>
  );
}

// Κοινό component άρθρου τραγουδιού — χρησιμοποιείται και από την Ελληνική
// και από την Αγγλική σελίδα. Το `song` πρέπει να είναι ήδη localized
// (βλ. lib/songs.js -> localizeSong) και το `lang` καθορίζει το λεξικό.
export default function SongArticle({ song, lang = "el" }) {
  const t = getDictionary(lang);
  const basePath = lang === "en" ? "/en" : "";

  const credits = [song.composer, song.lyricist]
    .filter((v, i, arr) => v && arr.indexOf(v) === i)
    .join(" / ");

  return (
    <article>
      <Link href={`${basePath}/`} className="text-sm text-brand hover:underline">
        {t.backToAll}
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="font-serif font-bold uppercase tracking-tight text-3xl sm:text-4xl text-ink leading-tight">
          {song.title}
        </h1>
        <p className="text-ink/60 mt-2">
          {credits}
          {song.year ? ` · ${song.year}` : ""}
          {song.performer ? ` · ${t.performerLabel} ${song.performer}` : ""}
        </p>
        {song.film && (
          <p className="text-ink/50 text-sm mt-1">
            {t.filmLabel} {song.film}
          </p>
        )}
        <div className="mt-4">
          <GradeBadge song={song} lang={lang} />
        </div>
        <DiamondDivider className="mt-6" />
      </header>

      {song.historicalPhoto && (
        <div className="mb-8 border border-black/10 rounded-lg p-4 bg-gold-light/60">
          <p className="text-ink/80 text-sm leading-relaxed italic">
            {song.historicalPhoto.caption}
          </p>
          {song.historicalPhoto.sourceUrl && (
            <a
              href={song.historicalPhoto.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 text-xs font-medium text-brand hover:underline"
            >
              {song.historicalPhoto.sourceLabel || t.seeSource} →
            </a>
          )}
        </div>
      )}

      <div className="prose-like space-y-5">
        {song.story.map((p, i) => (
          <p key={i} className="text-ink/85 leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      {song.quote && (
        <blockquote className="mt-8 border-l-4 border-brand pl-5 py-1 italic text-ink/90">
          «{song.quote}»
          {song.quoteAttribution && (
            <footer className="not-italic text-sm text-ink/50 mt-2">
              — {song.quoteAttribution}
            </footer>
          )}
        </blockquote>
      )}

      {song.quoteReply && (
        <blockquote className="mt-4 border-l-4 border-brand/40 pl-5 py-1 italic text-ink/90">
          «{song.quoteReply}»
          {song.quoteReplyAttribution && (
            <footer className="not-italic text-sm text-ink/50 mt-2">
              — {song.quoteReplyAttribution}
            </footer>
          )}
        </blockquote>
      )}

      {song.caveat && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
          <strong>{t.caveatLabel}</strong> {song.caveat}
        </div>
      )}

      {(song.firstPerformance || song.famousPerformance) && (
        <section className="mt-10">
          <h2 className="font-serif text-lg text-ink mb-3">{t.performancesHeading}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <PerformanceCard
              heading={t.firstPerformance}
              performance={song.firstPerformance}
              t={t}
            />
            {song.famousPerformance && !song.famousPerformance.sameAsFirst && (
              <PerformanceCard
                heading={t.famousPerformance}
                performance={song.famousPerformance}
                t={t}
              />
            )}
          </div>
          {song.famousPerformance?.sameAsFirst && song.famousPerformance.note && (
            <p className="text-sm text-ink/60 mt-3 italic">
              {song.famousPerformance.note}
            </p>
          )}
        </section>
      )}

      {song.interviewVideo && (
        <section className="mt-10">
          <h2 className="font-serif text-lg text-ink mb-3">{t.interviewHeading}</h2>
          <VideoEmbed url={song.interviewVideo.url} label={song.interviewVideo.label} />
        </section>
      )}

      {song.coverVideoUrl && (
        <div className="mt-10">
          <h2 className="font-serif text-lg text-ink mb-3">{t.coverHeading}</h2>
          <a
            href={song.coverVideoUrl}
            className="text-brand hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {t.watchVideo}
          </a>
        </div>
      )}

      {/* Πηγές — κάθε ισχυρισμός εδώ έχει δείξιμη, συνδεδεμένη πηγή.
          Κανόνας του site: καμία πληροφορία χωρίς αναφορά στο αρχικό site/δημιουργό. */}
      <section className="mt-12 pt-6 border-t border-black/10">
        <h2 className="font-serif text-lg text-ink mb-3">{t.sourcesHeading}</h2>
        <ul className="space-y-2">
          {song.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-brand hover:underline text-sm"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

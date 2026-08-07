import Link from "next/link";
import { notFound } from "next/navigation";
import { getSongBySlug, getAllSlugs } from "@/lib/songs";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const song = getSongBySlug(params.slug);
  if (!song) return {};
  return {
    title: `${song.title} — Ταξίδι στη Μουσική`,
    description: song.teaser,
  };
}

export default function SongPage({ params }) {
  const song = getSongBySlug(params.slug);
  if (!song) notFound();

  const isVerified = song.status === "verified";
  const credits = [song.composer, song.lyricist]
    .filter((v, i, arr) => v && arr.indexOf(v) === i)
    .join(" / ");

  return (
    <article>
      <Link href="/" className="text-sm text-brand hover:underline">
        ← Όλα τα τραγούδια
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-ink leading-tight">
          {song.title}
        </h1>
        <p className="text-ink/60 mt-2">
          {credits}
          {song.year ? ` · ${song.year}` : ""}
          {song.performer ? ` · Ερμηνεία: ${song.performer}` : ""}
        </p>
        {song.film && (
          <p className="text-ink/50 text-sm mt-1">Ταινία: {song.film}</p>
        )}
        <span
          className={`inline-block mt-4 text-xs font-medium px-2.5 py-1 rounded-full ${
            isVerified
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {isVerified ? "✅ " : "⚠️ "}
          {song.statusLabel}
        </span>
      </header>

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
          <strong>Σημείωση προσοχής:</strong> {song.caveat}
        </div>
      )}

      {song.coverVideoUrl && (
        <div className="mt-10">
          <h2 className="font-serif text-lg text-ink mb-3">Το cover</h2>
          <a
            href={song.coverVideoUrl}
            className="text-brand hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Δες το βίντεο →
          </a>
        </div>
      )}

      <section className="mt-12 pt-6 border-t border-black/10">
        <h2 className="font-serif text-lg text-ink mb-3">Πηγές</h2>
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

import Link from "next/link";
import { getDiscDict } from "@/lib/discDict";

// Σελίδα ερμηνευτή: όλοι οι δίσκοι με έτος, συνθέτη και σύνδεσμο στον δίσκο.
// performer.albums[]: { slug, title, year, composerSlug, composerName }
export default function PerformerContent({ performer, lang = "el" }) {
  const t = getDiscDict(lang);
  const basePath = lang === "en" ? "/en" : "";
  return (
    <article>
      <Link href={`${basePath}/composers#performers`} className="text-sm text-brand hover:underline">
        {t.performerBack}
      </Link>
      <header className="mt-6 mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold mb-3">{t.performerRole}</p>
        <h1 className="font-serif font-bold uppercase tracking-tight text-4xl sm:text-5xl text-ink leading-tight">
          {performer.name}
        </h1>
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink/50 mt-3">
          {t.performerAlbums(performer.albums.length)}
        </p>
      </header>
      <h2 className="sr-only">{t.performerAlbumsHeading}</h2>
      <ul className="divide-y divide-ink/10 max-w-3xl">
        {performer.albums.map((a) => (
          <li key={a.slug} className="py-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-mono text-xs text-ink/40 w-12 shrink-0">{a.year || "—"}</span>
            <Link href={`${basePath}/album/${a.slug}`} className="font-serif text-lg text-ink hover:text-brand transition-colors">
              {a.title}
            </Link>
            {a.composerName && (
              <span className="text-sm text-ink/50">
                {a.composerSlug ? (
                  <Link href={`${basePath}/composer/${a.composerSlug}`} className="hover:text-brand hover:underline">
                    {a.composerName}
                  </Link>
                ) : (
                  a.composerName
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}

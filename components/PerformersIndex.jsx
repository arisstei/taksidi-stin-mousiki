import Link from "next/link";
import { getDiscDict } from "@/lib/discDict";
import FilterableList from "@/components/FilterableList";

const PREVIEW = 10;

// Κάρτες ερμηνευτών: οι πρώτοι 10 δίσκοι (κατά έτος) και σύνδεσμος για τη σελίδα του.
export default function PerformersIndex({ performers, lang = "el" }) {
  const t = getDiscDict(lang);
  const basePath = lang === "en" ? "/en" : "";
  const items = performers.map((p) => ({
    id: p.slug,
    name: p.name,
    node: (
      <div className="archive-folder h-full">
        <div className="relative p-5 sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-2">{t.performerRole}</p>
          <h3 className="font-serif font-bold uppercase tracking-tight text-2xl text-ink leading-tight">
            <Link href={`${basePath}/performer/${p.slug}`} className="hover:text-brand transition-colors">
              {p.name}
            </Link>
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink/50 mt-2">{t.performerAlbums(p.albumCount)}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {p.albums.slice(0, PREVIEW).map((a) => (
              <li key={a.slug}>
                <Link href={`${basePath}/album/${a.slug}`} className="text-ink/80 hover:text-brand transition-colors">
                  {a.title}
                  {a.year ? <span className="text-ink/40"> · {a.year}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
          {p.albumCount > PREVIEW && (
            <Link
              href={`${basePath}/performer/${p.slug}`}
              className="inline-block mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-brand hover:underline"
            >
              {t.seeMore(p.albumCount)}
            </Link>
          )}
        </div>
      </div>
    ),
  }));
  return (
    <div>
      <p className="text-ink/70 mb-8 max-w-2xl leading-relaxed">{t.performersIntro}</p>
      <FilterableList items={items} lang={lang} className="grid gap-6 sm:grid-cols-2" />
    </div>
  );
}

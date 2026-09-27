import Link from "next/link";
import RecordSleeve from "@/components/RecordSleeve";
import { getDiscDict } from "@/lib/discDict";

// Κάρτες-φάκελοι συνθετών, με ένα "ράφι" από εξώφυλλα. Χρησιμοποιείται στην
// αρχική σελίδα και στη σελίδα /composers.
export default function ComposersIndex({ composers, lang = "el", compact = false }) {
  const t = getDiscDict(lang);
  const basePath = lang === "en" ? "/en" : "";
  return (
    <div className="grid gap-10">
      {composers.map((c) => {
        const shelf = c.albums.filter((a) => a.type !== "anthology").slice(0, compact ? 5 : 8);
        return (
          <Link key={c.slug} href={`${basePath}/composer/${c.slug}`} className="group block archive-folder">
            <span className="folder-tab font-mono text-[10px] uppercase tracking-[0.25em]">
              {lang === "en" ? "File" : "Φάκελος"} № {c.fileNo || "—"}
            </span>
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-2">
                    {t.composer} · {c.born?.slice(0, 4)}–{c.died?.slice(0, 4)}
                  </p>
                  <h3 className="font-serif font-bold uppercase tracking-tight text-3xl sm:text-4xl text-ink leading-none group-hover:text-brand transition-colors">
                    {c.name}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-ink/50 mt-3">
                    {t.albumsCount(c.albums.length)}
                  </p>
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand group-hover:translate-x-1 transition-transform">
                  {t.openFile}
                </span>
              </div>
              <div className="mt-6 flex gap-3 overflow-hidden">
                {shelf.map((a, i) => (
                  <div
                    key={a.slug}
                    className="w-20 sm:w-24 shrink-0 transition-transform duration-300 group-hover:-translate-y-1"
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    <RecordSleeve album={a} withVinyl={false} composerName={c.name} />
                  </div>
                ))}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

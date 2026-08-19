import Link from "next/link";
import { getAllSongs } from "@/lib/songs";
import SongExplorer from "@/components/SongExplorer";
import RandomSongButton from "@/components/RandomSongButton";

export default function HomePage() {
  const songs = getAllSongs();
  const realSongs = songs.filter((s) => !s.isProfile);
  const allSlugs = realSongs.map((s) => s.slug);

  const featured =
    realSongs.find((s) => s.slug === "mera-magiou" && s.quote) ||
    realSongs.find((s) => s.status === "verified" && s.quote) ||
    realSongs[0];

  return (
    <div>
      <section className="mb-14 max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold text-brand uppercase tracking-[0.2em] mb-3">
          Πραγματικές ιστορίες, όχι θρύλοι
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-ink mb-5">
          Κάθε τραγούδι <span className="text-brand">κρύβει</span> μια
          ιστορία
        </h1>
        <p className="text-ink/70 leading-relaxed text-lg">
          Γιατί γράφτηκε; Ποιος πόνεσε, ερωτεύτηκε ή θυμώνει πίσω από κάθε
          στίχο; Σκάβουμε σε συνεντεύξεις, βιβλία και επίσημα αρχεία — καμία
          φήμη δεν περνάει χωρίς απόδειξη.
        </p>
        <div className="mt-7">
          <RandomSongButton slugs={allSlugs} />
        </div>
      </section>

      {featured && (
        <section className="mb-14 max-w-2xl mx-auto">
          <Link
            href={`/song/${featured.slug}`}
            className="block group border border-black/10 rounded-xl p-6 sm:p-8 bg-white/70 hover:bg-white hover:border-gold/60 hover:shadow-md transition-all"
          >
            <p className="text-xs font-semibold text-gold uppercase tracking-wide mb-3">
              ✨ Μια ιστορία που θα σε συγκλονίσει
            </p>
            <p className="font-serif text-xl sm:text-2xl text-ink leading-snug italic">
              «{featured.quote}»
            </p>
            <p className="text-sm text-ink/50 mt-3">
              {featured.quoteAttribution} — από το{" "}
              <span className="text-brand group-hover:underline">
                {featured.title}
              </span>
            </p>
          </Link>
        </section>
      )}

      <SongExplorer songs={songs} />
    </div>
  );
}

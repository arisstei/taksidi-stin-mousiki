import Link from "next/link";
import { getAllSongs } from "@/lib/songs";

export default function HomePage() {
  const songs = getAllSongs();

  return (
    <div>
      <section className="mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-ink mb-4">
          Οι ιστορίες πίσω από τα τραγούδια
        </h1>
        <p className="text-ink/70 leading-relaxed">
          Πώς γράφτηκε πραγματικά κάθε τραγούδι — μόνο μέσα από συνεντεύξεις
          των ίδιων των δημιουργών, βιβλία και επίσημες πηγές. Όχι θρύλοι.
          Κάθε άρθρο δείχνει την κατάστασή του: αν είναι πλήρως τεκμηριωμένο ή
          αν ακόμη χρειάζεται μια πρωτογενή πηγή.
        </p>
      </section>

      <section className="space-y-6">
        {songs.map((song) => (
          <Link
            key={song.slug}
            href={`/song/${song.slug}`}
            className="block group border border-black/10 rounded-lg p-5 bg-white/60 hover:bg-white hover:border-brand/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl text-ink group-hover:text-brand transition-colors">
                  {song.title}
                </h2>
                <p className="text-sm text-ink/60 mt-1">
                  {[song.composer, song.lyricist]
                    .filter((v, i, arr) => v && arr.indexOf(v) === i)
                    .join(" / ")}
                  {song.year ? ` · ${song.year}` : ""}
                </p>
              </div>
              <StatusBadge status={song.status} label={song.statusLabel} />
            </div>
            <p className="text-ink/70 mt-3 leading-relaxed">{song.teaser}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

function StatusBadge({ status, label }) {
  const isVerified = status === "verified";
  return (
    <span
      className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
        isVerified
          ? "bg-green-100 text-green-800"
          : "bg-amber-100 text-amber-800"
      }`}
      title={label}
    >
      {isVerified ? "✅ Τεκμηριωμένο" : "⚠️ Προς επιβεβαίωση"}
    </span>
  );
}

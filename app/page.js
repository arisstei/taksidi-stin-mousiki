import { getAllSongs } from "@/lib/songs";
import SongExplorer from "@/components/SongExplorer";

export default function HomePage() {
  const songs = getAllSongs();

  return (
    <div>
      <section className="mb-8 max-w-2xl mx-auto text-center">
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

      <SongExplorer songs={songs} />
    </div>
  );
}

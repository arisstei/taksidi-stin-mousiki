export const metadata = {
  title: "Σχετικά",
  description:
    "Τι είναι το Ταξίδι στη Μουσική, και ο κανόνας πηγών που ακολουθούμε σε κάθε άρθρο.",
};

export default function AboutPage() {
  return (
    <article className="prose-like space-y-8">
      <header>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink leading-tight">
          Σχετικά με το{" "}
          <span className="text-brand">Ταξίδι στη Μουσική</span>
        </h1>
      </header>

      <section className="space-y-4">
        <h2 className="font-serif text-xl text-ink">Τι είναι αυτό το project</h2>
        <p className="text-ink/80 leading-relaxed">
          Το «Ταξίδι στη Μουσική» εξιστορεί τις πραγματικές, τεκμηριωμένες
          ιστορίες πίσω από ελληνικά έντεχνα και λαϊκά τραγούδια — από τη
          στιγμή που γράφτηκαν μέχρι τους ανθρώπους που τα έζησαν. Ξεκίνησε
          σαν ιδέα για ένα κανάλι (YouTube / Instagram / TikTok) και επεκτάθηκε
          σε blog, ώστε κάθε ιστορία να μπορεί να τεκμηριωθεί πλήρως — με
          παραπομπές, βίντεο-ντοκουμέντα και πηγές που ο καθένας μπορεί να
          ελέγξει ο ίδιος.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-xl text-ink">Ο κανόνας των πηγών</h2>
        <p className="text-ink/80 leading-relaxed">
          Κάθε ισχυρισμός εδώ χρειάζεται μια πηγή που μπορεί να δειχθεί —
          συνέντευξη του ίδιου του δημιουργού, επίσημο αρχείο (π.χ. Αρχείο
          ΕΡΤ), βιβλίο ή δημοσιευμένο άρθρο. Όταν μια ιστορία δεν έχει ακόμη
          πρωτογενή πηγή, δεν κρύβεται — σημειώνεται ρητά ως{" "}
          <span className="text-amber-800">⚠️ «Χρειάζεται πρωτογενή πηγή»</span>{" "}
          μέχρι να επιβεβαιωθεί.
        </p>
        <p className="text-ink/80 leading-relaxed">
          Όταν μια πηγή είναι βιβλίο, δεν αντιγράφουμε αυτούσιο το κείμενό
          του — το παραφράζουμε με ακριβή παραπομπή (τίτλος, συγγραφέας,
          εκδότης, έτος, σελίδα) και παραπέμπουμε στο ίδιο το βιβλίο για την
          πρωτότυπη διατύπωση. Οι δημοσιογραφικές πηγές (άρθρα, περιοδικά)
          μπορούν να παρατίθενται αυτούσια, με πλήρη αναφορά.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-xl text-ink">Ποιος το φτιάχνει</h2>
        <p className="text-ink/60 leading-relaxed italic">
          [Να συμπληρωθεί: λίγα λόγια για τον Αριστείδη — η σχέση του με τη
          μουσική, γιατί ξεκίνησε αυτό το project, και ο δικός του δρόμος ως
          τραγουδιστής.]
        </p>
      </section>
    </article>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="font-serif text-2xl text-ink mb-4">Δεν βρέθηκε</h1>
      <p className="text-ink/60 mb-6">Αυτή η σελίδα δεν υπάρχει.</p>
      <Link href="/" className="text-brand hover:underline">
        ← Πίσω στην αρχική
      </Link>
    </div>
  );
}

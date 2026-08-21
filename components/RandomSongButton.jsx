"use client";

import { useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const LAST_SLUG_KEY = "random-song-last-slug";

export default function RandomSongButton({
  slugs,
  basePath = "",
  label = "🎲 Έκπληξέ με με μια ιστορία",
}) {
  const router = useRouter();
  const pathname = usePathname();
  // Κρατάμε το τελευταίο slug που δείξαμε (σε ref + sessionStorage) ώστε
  // να μην ξαναβγεί το ίδιο άρθρο σε δύο διαδοχικά κλικ.
  const lastSlugRef = useRef(null);

  function goRandom() {
    if (!slugs || slugs.length === 0) return;

    let lastSlug = lastSlugRef.current;
    if (!lastSlug) {
      try {
        lastSlug = sessionStorage.getItem(LAST_SLUG_KEY);
      } catch {
        lastSlug = null;
      }
    }
    // Επίσης απέκλεισε το τραγούδι της τρέχουσας σελίδας, αν είμαστε ήδη
    // σε άρθρο τραγουδιού.
    const currentSlug = pathname?.split("/song/")[1];

    let pool = slugs.filter((s) => s !== lastSlug && s !== currentSlug);
    if (pool.length === 0) pool = slugs;

    const pick = pool[Math.floor(Math.random() * pool.length)];

    lastSlugRef.current = pick;
    try {
      sessionStorage.setItem(LAST_SLUG_KEY, pick);
    } catch {
      // αγνόησε (π.χ. private browsing χωρίς πρόσβαση σε storage)
    }

    router.push(`${basePath}/song/${pick}`);
  }

  return (
    <button
      onClick={goRandom}
      className="inline-flex items-center gap-2 rounded-full bg-brand text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-brand-dark hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      {label}
    </button>
  );
}

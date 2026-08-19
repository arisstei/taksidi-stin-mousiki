"use client";

import { useRouter } from "next/navigation";

export default function RandomSongButton({ slugs }) {
  const router = useRouter();

  function goRandom() {
    if (!slugs || slugs.length === 0) return;
    const pick = slugs[Math.floor(Math.random() * slugs.length)];
    router.push(`/song/${pick}`);
  }

  return (
    <button
      onClick={goRandom}
      className="inline-flex items-center gap-2 rounded-full bg-brand text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-brand-dark hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      🎲 Έκπληξέ με με μια ιστορία
    </button>
  );
}

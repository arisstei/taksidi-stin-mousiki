import { sleeveFor } from "@/lib/sleeves";

// Μικρογραφία για τραγούδια χωρίς βίντεο: αν ανήκουν σε δίσκο του αρχείου,
// το (δικό μας) εξώφυλλο του δίσκου με το βινύλιο να ξεπροβάλλει· αλλιώς ένα
// βινύλιο με το αρχικό του τίτλου στην ετικέτα.
export default function SongThumbFallback({ song }) {
  const album = song.albumSleeve;
  if (album) {
    const s = sleeveFor(album.slug);
    return (
      <div className="absolute inset-0 bg-[#efe6d4] overflow-hidden">
        <div
          aria-hidden="true"
          className="vinyl rounded-full absolute top-[10%] left-[34%] h-[80%] aspect-square transition-transform duration-500 group-hover:translate-x-[18%] group-hover:rotate-45"
          style={{ "--label": s.label }}
        />
        <div
          className="absolute top-[10%] left-[8%] h-[80%] aspect-square flex flex-col justify-between p-1 shadow-[0_2px_6px_-2px_rgba(0,0,0,0.45)]"
          style={{ backgroundColor: s.bg, color: s.fg }}
        >
          <span className="block h-px w-full" style={{ backgroundColor: s.accent }} />
          <span className="font-serif text-[7px] leading-[1.05] font-bold uppercase line-clamp-3">{album.title}</span>
          <span className="font-mono text-[6px] opacity-75">{album.year}</span>
        </div>
      </div>
    );
  }
  const s = sleeveFor(song.slug);
  const initial = (song.title || "♪").trim().charAt(0);
  return (
    <div className="absolute inset-0 bg-[#efe6d4] flex items-center justify-center">
      <div className="relative h-[82%] aspect-square">
        <div aria-hidden="true" className="vinyl rounded-full absolute inset-0" style={{ "--label": s.label }} />
        <span
          className="absolute inset-0 flex items-center justify-center font-serif font-bold text-[13px]"
          style={{ color: s.bg }}
        >
          {initial}
        </span>
      </div>
    </div>
  );
}

import { sleeveFor } from "@/lib/sleeves";

// Τυπογραφικό "εξώφυλλο" δίσκου, εμπνευσμένο από τα ελληνικά LP των '60s
// (Columbia, Lyra, Fidelity, Philips). ΔΕΝ αναπαράγει τα πραγματικά εξώφυλλα
// — είναι δικό μας σχέδιο, ώστε να μην υπάρχει ζήτημα πνευματικών δικαιωμάτων.

function shortLabel(label) {
  if (!label) return "";
  return label.split(/[;,]/)[0].replace(/\s*\(\d+\)/, "").trim();
}

export function Vinyl({ color = "#e9c98a", className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`vinyl rounded-full ${className}`}
      style={{ "--label": color }}
    />
  );
}

export default function RecordSleeve({ album, size = "md", withVinyl = true, composerName }) {
  const s = sleeveFor(album.slug);
  const isLg = size === "lg";
  const titleSize = isLg
    ? "text-3xl sm:text-4xl"
    : album.title.length > 28
    ? "text-base"
    : "text-lg sm:text-xl";

  return (
    <div className="relative aspect-square w-full">
      {withVinyl && (
        <Vinyl
          color={s.label}
          className="absolute inset-[4%] transition-transform duration-500 ease-out group-hover:translate-x-[22%] group-hover:rotate-[25deg]"
        />
      )}
      <div
        className="sleeve absolute inset-0 overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.05),0_8px_20px_-10px_rgba(36,27,22,0.45)]"
        style={{ backgroundColor: s.bg, color: s.fg }}
      >
        {s.variant === 0 && (
          <div className="absolute inset-0 p-[8%] flex flex-col">
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] opacity-70">
              {composerName || "Μάνος Χατζιδάκις"}
            </p>
            <div className="h-px my-[6%]" style={{ backgroundColor: s.accent }} />
            <h3 className={`font-serif font-bold uppercase leading-[0.95] tracking-tight ${titleSize}`}>
              {album.title}
            </h3>
            <div className="mt-auto flex items-end justify-between">
              <span
                className="block w-[28%] aspect-square rounded-full"
                style={{ backgroundColor: s.accent, opacity: 0.9 }}
              />
              <span className="font-mono text-[9px] opacity-70">{album.year}</span>
            </div>
          </div>
        )}

        {s.variant === 1 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-[10%]">
            <span
              className="absolute w-[70%] aspect-square rounded-full"
              style={{ border: `2px solid ${s.accent}`, opacity: 0.55 }}
            />
            <span
              className="absolute w-[52%] aspect-square rounded-full"
              style={{ border: `1px solid ${s.accent}`, opacity: 0.35 }}
            />
            <h3 className={`relative font-serif italic leading-tight ${titleSize}`}>{album.title}</h3>
            <p className="relative font-mono text-[9px] uppercase tracking-[0.25em] mt-2 opacity-75">
              {album.year}
            </p>
          </div>
        )}

        {s.variant === 2 && (
          <div className="absolute inset-0 flex">
            <div className="w-[22%] h-full flex flex-col">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: i % 2 ? s.accent : "transparent", opacity: 0.85 }}
                />
              ))}
            </div>
            <div className="flex-1 p-[8%] flex flex-col justify-between">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-70">
                {shortLabel(album.label) || "LP"}
              </p>
              <h3 className={`font-serif font-bold leading-[1] ${titleSize}`}>{album.title}</h3>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-70">
                {composerName || "Μ. Χατζιδάκις"} · {album.year}
              </p>
            </div>
          </div>
        )}

        {s.variant === 3 && (
          <div className="absolute inset-[6%] flex flex-col" style={{ border: `1.5px solid ${s.accent}` }}>
            <div
              className="text-center font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] py-1"
              style={{ backgroundColor: s.accent, color: s.bg }}
            >
              {album.year && Number(album.year) < 1968 ? "Μονοφωνικόν" : "Στερεοφωνικόν"}
            </div>
            <div className="flex-1 flex items-center justify-center text-center px-[8%]">
              <h3 className={`font-serif font-bold uppercase tracking-tight leading-[1] ${titleSize}`}>
                {album.title}
              </h3>
            </div>
            <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] pb-2 opacity-75">
              {composerName || "Μάνος Χατζιδάκις"}
            </p>
          </div>
        )}

        {/* φθορά χαρτονιού στις άκρες */}
        <span aria-hidden="true" className="sleeve-wear absolute inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

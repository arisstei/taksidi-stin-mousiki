// Ενσωμάτωση βίντεο από επίσημες πηγές: τον επίσημο player του Αρχείου της
// ΕΡΤ (archive.ert.gr — τον ίδιο που χρησιμοποιεί και η ΕΡΤ στα άρθρα της)
// ή το YouTube. Πάντα με σύνδεσμο στην πρωτότυπη σελίδα της πηγής.

function ertEmbed(file) {
  return `https://archive.ert.gr/webtv/live-uni/vod/dt-uni-vod-arxeio-mp4.php?f=${file}`;
}

function youtubeEmbed(url) {
  if (!url) return null;
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export default function ArchiveVideo({ video, lang = "el", compact = false }) {
  if (!video) return null;
  const src = video.ertFile ? ertEmbed(video.ertFile) : youtubeEmbed(video.youtube);
  const sourceLabel = video.ertFile
    ? lang === "en"
      ? "ERT Archive"
      : "Αρχείο ΕΡΤ"
    : "YouTube";

  return (
    <figure className={`archive-frame ${compact ? "" : "p-3 sm:p-4"}`}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">
          {video.code ? `${lang === "en" ? "Item" : "Τεκμήριο"} ${video.code} · ` : ""}
          {sourceLabel}
          {video.year ? ` · ${video.year}` : ""}
        </span>
        <span aria-hidden="true" className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand/70" />
          <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
        </span>
      </div>
      {src && (
        <div className="aspect-video bg-ink/90 overflow-hidden rounded-sm">
          <iframe
            src={src}
            title={video.title}
            className="w-full h-full"
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      )}
      <figcaption className="mt-3">
        <p className="font-serif text-ink leading-snug">{video.title}</p>
        {video.note && <p className="text-sm text-ink/65 mt-1 leading-relaxed">{video.note}</p>}
        {video.sourceUrl && (
          <a
            href={video.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-2 text-xs font-semibold uppercase tracking-wide text-brand hover:underline"
          >
            {lang === "en" ? "Original source page →" : "Σελίδα της πηγής →"}
          </a>
        )}
      </figcaption>
    </figure>
  );
}

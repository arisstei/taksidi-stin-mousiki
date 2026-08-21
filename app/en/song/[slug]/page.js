import { getSongBySlug, getAllSlugs, localizeSong } from "@/lib/songs";
import { SITE_URL } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import SongArticle from "@/components/SongArticle";

const SITE_NAME = getDictionary("en").siteName;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const raw = getSongBySlug(params.slug);
  if (!raw) return {};
  const song = localizeSong(raw, "en");
  const url = `${SITE_URL}/en/song/${song.slug}`;
  return {
    title: { absolute: `${song.title} — ${SITE_NAME}` },
    description: song.teaser,
    alternates: {
      canonical: url,
      languages: { el: `${SITE_URL}/song/${song.slug}`, en: url },
    },
    openGraph: {
      type: "article",
      title: song.title,
      description: song.teaser,
      url,
    },
  };
}

function buildJsonLd(song, url) {
  if (song.isProfile) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: song.title,
      description: song.teaser,
      url,
      author: { "@type": "Organization", name: SITE_NAME },
      publisher: { "@type": "Organization", name: SITE_NAME },
    };
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    name: song.title,
    url,
    description: song.teaser,
  };
  if (song.composer) jsonLd.composer = { "@type": "Person", name: song.composer };
  if (song.lyricist) jsonLd.lyricist = { "@type": "Person", name: song.lyricist };
  if (song.year) jsonLd.dateCreated = String(song.year).slice(0, 4);
  return jsonLd;
}

export default function EnglishSongPage({ params }) {
  const raw = getSongBySlug(params.slug);
  if (!raw) return null;
  const song = localizeSong(raw, "en");

  const canonicalUrl = `${SITE_URL}/en/song/${song.slug}`;
  const jsonLd = buildJsonLd(song, canonicalUrl);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SongArticle song={song} lang="en" />
    </>
  );
}

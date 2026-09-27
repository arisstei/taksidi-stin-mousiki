import { getSongBySlug, getAllSlugs } from "@/lib/songs";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import SongArticle from "@/components/SongArticle";
import { getAlbumsForSong } from "@/lib/albums";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const song = getSongBySlug(params.slug);
  if (!song) return {};
  const url = `${SITE_URL}/song/${song.slug}`;
  return {
    title: song.title,
    description: song.teaser,
    alternates: {
      canonical: url,
      languages: { el: url, en: `${SITE_URL}/en/song/${song.slug}` },
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
  if (song.composer) {
    jsonLd.composer = { "@type": "Person", name: song.composer };
  }
  if (song.lyricist) {
    jsonLd.lyricist = { "@type": "Person", name: song.lyricist };
  }
  if (song.year) {
    jsonLd.dateCreated = String(song.year).slice(0, 4);
  }
  return jsonLd;
}

export default function SongPage({ params }) {
  const song = getSongBySlug(params.slug);
  if (!song) return null;

  const canonicalUrl = `${SITE_URL}/song/${song.slug}`;
  const jsonLd = buildJsonLd(song, canonicalUrl);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SongArticle song={song} lang="el" albums={getAlbumsForSong(song.slug).map((a) => ({ slug: a.slug, title: a.title, year: a.year, label: a.label }))} />
    </>
  );
}

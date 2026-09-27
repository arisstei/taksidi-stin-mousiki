import { notFound } from "next/navigation";
import { getAllAlbums, getAlbumBySlug, getComposerBySlug, getAlbumsByComposer, localizeAlbum, localizeComposer } from "@/lib/albums";
import { SITE_URL } from "@/lib/site";
import AlbumArticle from "@/components/AlbumArticle";

const LANG = "en";
const PREFIX = "/en";

export function generateStaticParams() {
  return getAllAlbums().map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const raw = getAlbumBySlug(params.slug);
  if (!raw) return {};
  const a = localizeAlbum(raw, LANG);
  const c = getComposerBySlug(raw.composer);
  const url = `${SITE_URL}${PREFIX}/album/${a.slug}`;
  const title = `${a.title} (${a.year})${c ? ` — ${c.name}` : ""}`;
  const description = a.teaser || (a.about && a.about[0]) || title;
  return {
    title: LANG === "en" ? { absolute: `${title} — A Journey Through Music` } : title,
    description: description.slice(0, 200),
    alternates: {
      canonical: url,
      languages: { el: `${SITE_URL}/album/${a.slug}`, en: `${SITE_URL}/en/album/${a.slug}` },
    },
    openGraph: { type: "music.album", title, description: description.slice(0, 200), url },
  };
}

export default function AlbumPage({ params }) {
  const raw = getAlbumBySlug(params.slug);
  if (!raw) notFound();
  const album = localizeAlbum(raw, LANG);
  const composer = localizeComposer(getComposerBySlug(raw.composer), LANG);
  const siblings = getAlbumsByComposer(raw.composer);
  const i = siblings.findIndex((x) => x.slug === raw.slug);
  const prev = i > 0 ? siblings[i - 1] : null;
  const next = i >= 0 && i < siblings.length - 1 ? siblings[i + 1] : null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: raw.title,
    datePublished: String(raw.year),
    byArtist: { "@type": "Person", name: composer?.name },
    recordLabel: raw.label ? { "@type": "Organization", name: raw.label } : undefined,
    numTracks: (raw.tracks || []).length,
    track: (raw.tracks || []).map((t, n) => ({ "@type": "MusicRecording", name: t.title, position: n + 1 })),
    url: `${SITE_URL}${PREFIX}/album/${raw.slug}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AlbumArticle album={album} composer={composer} prev={prev} next={next} lang={LANG} />
    </>
  );
}

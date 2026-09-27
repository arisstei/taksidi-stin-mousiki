import { notFound } from "next/navigation";
import { getAllLyricists, getLyricistBySlug, localizeLyricist } from "@/lib/lyricists";
import { SITE_URL } from "@/lib/site";
import LyricistContent from "@/components/LyricistContent";

const LANG = "en";
const PREFIX = "/en";

export function generateStaticParams() {
  return getAllLyricists().map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }) {
  const l = localizeLyricist(getLyricistBySlug(params.slug), LANG);
  if (!l) return {};
  const url = `${SITE_URL}${PREFIX}/lyricist/${l.slug}`;
  const title = LANG === "en" ? `${l.name} — All the songs` : `${l.name} — Όλα τα τραγούδια`;
  return {
    title: LANG === "en" ? { absolute: `${title} — A Journey Through Music` } : title,
    description: l.tagline,
    alternates: { canonical: url, languages: { el: `${SITE_URL}/lyricist/${l.slug}`, en: `${SITE_URL}/en/lyricist/${l.slug}` } },
    openGraph: { type: "profile", title, description: l.tagline, url },
  };
}

export default function LyricistPage({ params }) {
  const raw = getLyricistBySlug(params.slug);
  if (!raw) notFound();
  const person = localizeLyricist(raw, LANG);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: raw.name,
    birthDate: raw.born,
    deathDate: raw.died,
    jobTitle: "Poet, lyricist",
    url: `${SITE_URL}${PREFIX}/lyricist/${raw.slug}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LyricistContent person={person} lang={LANG} />
    </>
  );
}

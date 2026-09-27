import { notFound } from "next/navigation";
import { getAllComposers, getComposerBySlug, getAlbumsByComposer, localizeComposer, localizeAlbum } from "@/lib/albums";
import { SITE_URL } from "@/lib/site";
import { getDiscDict } from "@/lib/discDict";
import ComposerContent from "@/components/ComposerContent";

const LANG = "el";
const PREFIX = "";

export function generateStaticParams() {
  return getAllComposers().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const c = localizeComposer(getComposerBySlug(params.slug), LANG);
  if (!c) return {};
  const url = `${SITE_URL}${PREFIX}/composer/${c.slug}`;
  return {
    title: getDiscDict(LANG).composerPageTitle(c.name),
    description: c.tagline,
    alternates: {
      canonical: url,
      languages: { el: `${SITE_URL}/composer/${c.slug}`, en: `${SITE_URL}/en/composer/${c.slug}` },
    },
    openGraph: { type: "profile", title: c.name, description: c.tagline, url },
  };
}

export default function ComposerPage({ params }) {
  const raw = getComposerBySlug(params.slug);
  if (!raw) notFound();
  const composer = localizeComposer(raw, LANG);
  const albums = getAlbumsByComposer(raw.slug).map((a) => localizeAlbum(a, LANG));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: raw.name,
    birthDate: raw.born,
    deathDate: raw.died,
    jobTitle: "Composer",
    url: `${SITE_URL}${PREFIX}/composer/${raw.slug}`,
    sameAs: raw.sameAs || [],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ComposerContent composer={composer} albums={albums} lang={LANG} />
    </>
  );
}

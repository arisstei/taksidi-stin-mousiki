import { notFound } from "next/navigation";
import { getAllPerformers, getPerformerBySlug } from "@/lib/performers";
import { getComposerBySlug, localizeComposer } from "@/lib/albums";
import { SITE_URL } from "@/lib/site";
import { getDiscDict } from "@/lib/discDict";
import PerformerContent from "@/components/PerformerContent";

const LANG = "en";
const PREFIX = "/en";

export function generateStaticParams() {
  return getAllPerformers().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getPerformerBySlug(params.slug);
  if (!p) return {};
  const url = `${SITE_URL}${PREFIX}/performer/${p.slug}`;
  return {
    title: { absolute: `${getDiscDict(LANG).performerPageTitle(p.name)} — A Journey Through Music` },
    description: `${p.name} — ${getDiscDict(LANG).performerAlbums(p.albumCount)}`,
    alternates: {
      canonical: url,
      languages: { el: `${SITE_URL}/performer/${p.slug}`, en: `${SITE_URL}/en/performer/${p.slug}` },
    },
  };
}

export default function PerformerPage({ params }) {
  const raw = getPerformerBySlug(params.slug);
  if (!raw) notFound();
  const cache = {};
  const albums = raw.albums.map((a) => {
    if (a.composer && !(a.composer in cache)) {
      const c = getComposerBySlug(a.composer);
      cache[a.composer] = c ? localizeComposer(c, LANG).name : null;
    }
    return { ...a, composerSlug: cache[a.composer] ? a.composer : null, composerName: cache[a.composer] || null };
  });
  return <PerformerContent performer={{ ...raw, albums }} lang={LANG} />;
}

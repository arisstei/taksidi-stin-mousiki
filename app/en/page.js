import { getAllSongs } from "@/lib/songs";
import { SITE_URL } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import HomeContent from "@/components/HomeContent";

const t = getDictionary("en");

export const metadata = {
  title: { absolute: `${t.siteName} — ${t.siteTagline}` },
  description: t.siteDescription,
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: { el: SITE_URL, en: `${SITE_URL}/en` },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: t.siteName,
    title: `${t.siteName} — ${t.siteTagline}`,
    description: t.siteDescription,
    url: `${SITE_URL}/en`,
  },
};

export default function EnglishHomePage() {
  const songs = getAllSongs();
  return <HomeContent songs={songs} lang="en" />;
}

import { getAllSongs } from "@/lib/songs";
import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  const songs = getAllSongs();

  const songEntries = songs.map((song) => ({
    url: `${SITE_URL}/song/${song.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: song.isProfile ? 0.5 : 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    ...songEntries,
  ];
}

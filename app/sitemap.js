import { getAllSongs } from "@/lib/songs";
import { SITE_URL } from "@/lib/site";
import { getAllAlbums, getAllComposers } from "@/lib/albums";

export default function sitemap() {
  const songs = getAllSongs();

  const songEntries = songs.flatMap((song) => [
    {
      url: `${SITE_URL}/song/${song.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: song.isProfile ? 0.5 : 0.8,
    },
    {
      url: `${SITE_URL}/en/song/${song.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: song.isProfile ? 0.4 : 0.7,
    },
  ]);

  const discEntries = [
    ...getAllComposers().flatMap((c) => [
      { url: `${SITE_URL}/composer/${c.slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE_URL}/en/composer/${c.slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ]),
    ...getAllAlbums().flatMap((a) => [
      { url: `${SITE_URL}/album/${a.slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
      { url: `${SITE_URL}/en/album/${a.slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ]),
    { url: `${SITE_URL}/composers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/en/composers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/en/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.35,
    },
    ...songEntries,
    ...discEntries,
  ];
}

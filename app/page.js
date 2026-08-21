import { getAllSongs } from "@/lib/songs";
import HomeContent from "@/components/HomeContent";

export default function HomePage() {
  const songs = getAllSongs();
  return <HomeContent songs={songs} lang="el" />;
}

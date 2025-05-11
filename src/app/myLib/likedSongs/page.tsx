import SongsOrganizer from "@/components/songsGrid/SongsGrid";
import { authOptions } from "@/lib/auth";
import { SongType } from "@/types/response";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function fetchData(username: string) {
  const likedSongs: SongType[] = await fetch(
    `${process.env.URL}/api/song/likedSong?username=${username}`
  ).then((res) => res.json());

  return likedSongs;
}

export default async function LikedSongs() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("404");

  const username = session.user.name;
  const songs = await fetchData(username);

  return <div>{songs.length > 0 && <SongsOrganizer songs={songs} />}</div>;
}

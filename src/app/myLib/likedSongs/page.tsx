import SongsOrganizer from "@/app/components/organizer/SongsOrganizer";
import { authOptions } from "@/lib/auth";
import { SongType } from "@/types/response";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function fetchData(username: string) {
  const data: SongType[] = await fetch(
    `${process.env.URL}/api/song/likedSong?username=${username}`
  ).then((res) => res.json());

  return data;
}

export default async function LikedSongs() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("404");

  const username = session.user.name;
  console.log(username);
  const songs = await fetchData(username);

  return <div>{<SongsOrganizer songs={songs} />}</div>;
}

"use server";

import { GenericHeader, SongsGridQuery } from "@/components";

import { authOptions } from "@/lib/auth";

import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

async function getData(playlistId: string, username: string) {
  const response = await fetch(`${process.env.URL}/api/playlist?playlistId=${playlistId}&username=${username}`).then(
    (res) => res.json()
  );
  if (response.error) {
    if (response.status === 404) return notFound();
    throw new Error(response.message);
  }
  return response;
}

export default async function Playlist(props: { params: Promise<{ playlistId: string }> }) {
  const params = await props.params;

  const { playlistId } = params;

  const session = await getServerSession(authOptions);
  const user = session?.user;
  const info = await getData(playlistId, user?.name as string);

  return (
    <div className="flex relative flex-col">
      <GenericHeader username={user?.name} info={info} vibrantColor={info?.vibrantColor} playlistId={playlistId} />
      <SongsGridQuery
        playlistId={playlistId}
        queryKey={["SongsPlaylist", playlistId]}
        url={`/api/playlist/songs?playlistId=${playlistId}&username=${user?.name}`}
        username={user?.name}
        isOwner={info.isOwner}
      />
    </div>
  );
}

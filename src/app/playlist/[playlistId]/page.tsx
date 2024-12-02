"use server";

import GenericHeader from "@/components/headers/GenericHeader";
import SongsQueryOrganizer from "@/components/organizer/SongsQueryOrganizer";

import { authOptions } from "@/lib/auth";

import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

async function getData(playlistId: string, username: string) {
  const response = await fetch(
    `${process.env.URL}/api/playlist?playlistId=${playlistId}&username=${username}`
  ).then((res) => res.json());
  if (response.error) {
    if (response.status === 404) return notFound()
    throw new Error(response.message);
  }
  return response;
}

export default async function Playlist({
  params: { playlistId },
}: {
  params: { playlistId: string };
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const info = await getData(playlistId, user?.name as string);
  return (
    <div className="flex relative flex-col pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      <GenericHeader info={info} playlistId={playlistId} />
      <SongsQueryOrganizer
        playlistId={playlistId}
        queryKey={["SongsPlaylist", playlistId]}
        url={`/api/playlist/songs?playlistId=${playlistId}&username=${user?.name}`}
        username={user?.name}
        isOwner={info.isOwner}
      />
    </div>
  );
}

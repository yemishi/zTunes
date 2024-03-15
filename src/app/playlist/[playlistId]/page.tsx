"use server";

import GenericHeader from "@/app/components/headers/GenericHeader";
import SongsOrganizer from "@/app/components/organizer/SongsOrganizer";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

async function getData(playlistId: string, username: string) {
  const playlistProps = await fetch(
    `${process.env.URL}/api/playlist/songs?playlistId=${playlistId}&username=${username}`
  ).then((res) => res.json());
  return playlistProps;
}

export default async function Playlist({
  params,
}: {
  params: { playlistId: string };
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const data = await getData(params.playlistId, user?.name as string);

  return (
    <div className="flex flex-col pb-32">
      <GenericHeader
        info={data.info}
        songs={data.songs}
        playlistId={params.playlistId}
      />
      <SongsOrganizer playlistId={params.playlistId} songs={data.songs} />
    </div>
  );
}

"use server";

import GenericHeader from "@/app/components/headers/GenericHeader";
import SongsOrganizer from "@/app/components/organizer/SongsOrganizer";
import { getVibrantColor } from "@/app/utils/fnc";
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
  const vibrantColor = await getVibrantColor(data.info.coverPhoto);
  return (
    <div className="flex flex-col pb-32">
      <GenericHeader
        bgFrom={vibrantColor.default}
        info={data.info}
        songs={data.songs}
      />
      <SongsOrganizer playlistId={data.info.playlistId} songs={data.songs} />
    </div>
  );
}

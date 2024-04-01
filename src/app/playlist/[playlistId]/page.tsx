"use server";

import GenericHeader from "@/components/headers/GenericHeader";
import SongsOrganizer from "@/components/organizer/SongsOrganizer";

import { authOptions } from "@/lib/auth";
import { ErrorType } from "@/types/response";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type ResponseType = {
  avatar: string;
  title: string;
  author: string;
  coverPhoto: string;
  authorId: string;
  isOwner: boolean;
  desc?: string;
  isUser?: Boolean;
  isOfficial?: boolean;
  releasedDate?: string;
  urlsSongs: string[];
  error: false;
};

async function getData(playlistId: string, username: string) {
  const response: ResponseType | ErrorType = await fetch(
    `${process.env.URL}/api/playlist?playlistId=${playlistId}&username=${username}`
  ).then((res) => res.json());
  if (response.error) return redirect("/404");

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
    <div className="flex flex-col pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      <GenericHeader info={info} playlistId={playlistId} />

      <SongsOrganizer
        playlistId={playlistId}
        queryKey={["SongsPlaylist", playlistId]}
        url={`/api/playlist/songs?playlistId=${playlistId}&username=${user?.name}`}
      />
    </div>
  );
}

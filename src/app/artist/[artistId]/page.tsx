"use server";

import { BundleType, ArtistResponse } from "@/types/response";
import { redirect } from "next/navigation";
import { getVibrantColor } from "@/app/utils/fnc";
import ArtistHeader from "@/app/components/headers/ArtistHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BundleOrganizer from "@/app/components/organizer/BundleOrganizer";

async function getData(artistId: string) {
  const artistInfo: ArtistResponse = await fetch(
    `${process.env.URL}/api/artist?id=${artistId}`
  ).then((res) => res.json());

  const albums: BundleType[] = await fetch(
    `${process.env.URL}/api/album?artistId=${artistId}`
  ).then((res) => res.json());

  return {
    artistInfo,
    albums,
  };
}

async function getFollowers(username: string, artistId: string) {
  const data = await fetch(
    `${process.env.URL}/api/followers?artistId=${artistId}&username=${username}`
  ).then((res) => res.json());
  return data;
}

export default async function Artist({
  params,
}: {
  params: { artistId: string };
}) {
  const { albums, artistInfo } = await getData(params.artistId);

  if (artistInfo.error) return redirect("404");

  const vibrantColor = await getVibrantColor(artistInfo.cover);
  const session = await getServerSession(authOptions);
  const followers = await getFollowers(
    session?.user.name as string,
    artistInfo.id
  );
  console.log(albums);
  return (
    <div className="w-full h-full flex flex-col">
      <ArtistHeader
        username={session?.user.name as string}
        followersLength={followers.length}
        isInclude={followers.isInclude}
        vibrantColor={vibrantColor.mutedDark}
        artistInfo={{
          artistId: artistInfo.id,
          artistName: artistInfo.name,
          cover: artistInfo.cover,
        }}
      />
      <BundleOrganizer baseUrl="/album" title="Albuns" props={albums} />
    </div>
  );
}

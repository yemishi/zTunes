"use server";

import { BundleType, ArtistType, SongType } from "@/types/response";
import { redirect } from "next/navigation";
import { getVibrantColor } from "@/app/utils/fnc";
import ArtistHeader from "@/app/components/headers/ArtistHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BundleOrganizer from "@/app/components/organizer/BundleOrganizer";
import SongsOrganizer from "@/app/components/organizer/SongsOrganizer";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import ArtistAbout from "@/app/components/artistAbout/ArtistAbout";

async function getData(artistId: string) {
  const artistInfo: ArtistType = await fetch(
    `${process.env.URL}/api/artist?id=${artistId}`
  ).then((res) => res.json());

  const albums: BundleType[] = await fetch(
    `${process.env.URL}/api/album?artistId=${artistId}`
  ).then((res) => res.json());

  const songs: SongType[] = await fetch(
    `${process.env.URL}/api/song?artistId=${artistId}`
  ).then((res) => res.json());

  return {
    songs,
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
  const { albums, artistInfo, songs } = await getData(params.artistId);

  if (artistInfo.error) return redirect("404");

  const vibrantColor = await getVibrantColor(artistInfo.cover);
  const session = await getServerSession(authOptions);
  const followers = await getFollowers(
    session?.user.name as string,
    artistInfo.id
  );

  return (
    <div className="w-full h-full flex flex-col gap-3 pb-28 overflow-y-scroll">
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
      <SongsOrganizer songs={songs} title="Musics" />
      <Button
        asChild
        className="bg-white rounded-lg self-start ml-4 text-black"
      >
        <Link href={`/artist/${artistInfo.id}/musics`}>Show all</Link>
      </Button>
      <BundleOrganizer baseUrl="/album" title="Albums" props={albums} />
      <ArtistAbout about={artistInfo.about} />
    </div>
  );
}

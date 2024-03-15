"use server";

import Link from "next/link";
import { BundleType, ArtistType, SongType } from "@/types/response";
import { redirect } from "next/navigation";
import { getVibrantColor } from "@/app/utils/fnc";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import Button from "@/app/components/ui/buttons/Button";
import ArtistAbout from "@/app/components/artistAbout/ArtistAbout";
import ProfileHeader from "@/app/components/headers/ProfileHeader";
import BundleOrganizer from "@/app/components/organizer/BundleOrganizer";
import SongsOrganizer from "@/app/components/organizer/SongsOrganizer";

async function getData(artistId: string) {
  const artistInfo: ArtistType = await fetch(
    `${process.env.URL}/api/artist?id=${artistId}`
  ).then((res) => res.json());

  const albumsBundle: BundleType[] = await fetch(
    `${process.env.URL}/api/album?artistId=${artistId}`
  ).then((res) => res.json());

  const songs: SongType[] = await fetch(
    `${process.env.URL}/api/song?artistId=${artistId}`
  ).then((res) => res.json());

  return {
    songs,
    artistInfo,
    albumsBundle,
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
  const { albumsBundle, artistInfo, songs } = await getData(params.artistId);

  if (artistInfo.error) return redirect("404");

  const vibrantColor = await getVibrantColor(artistInfo.cover).then(
    (res) => res?.mutedDark
  );
  const session = await getServerSession(authOptions);
  const followers = await getFollowers(
    session?.user.name as string,
    artistInfo.id
  );
  const singles = albumsBundle.filter(
    (album) => album.type.toLowerCase() === "single"
  );
  const albums = albumsBundle.filter(
    (album) => album.type.toLowerCase() === "album"
  );
  return (
    <div className="w-full h-full flex flex-col gap-3 pb-28 overflow-y-scroll">
      <ProfileHeader
        username={session?.user.name as string}
        followersLength={followers.length}
        isInclude={followers.isInclude}
        vibrantColor={vibrantColor || "transparent"}
        profileInfo={{
          profileId: artistInfo.id,
          profileName: artistInfo.name,
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

      <Link
        href={`/artist/${artistInfo.id}/discography`}
        className="self-end mr-4 font-kanit text-lg text-white text-opacity-50 underline underline-offset-[6px] hover:text-opacity-100 duration-100"
      >
        See discography
      </Link>
      {!!albums.length && (
        <BundleOrganizer baseUrl="/album" title="Albums" props={albums} />
      )}
      {!!singles.length && (
        <BundleOrganizer baseUrl="/album" title="Singles" props={singles} />
      )}

      <ArtistAbout about={artistInfo.about} />
    </div>
  );
}

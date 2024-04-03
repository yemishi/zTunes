"use server";

import Link from "next/link";
import { BundleType, ArtistType, SongType } from "@/types/response";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import Button from "@/components/ui/buttons/Button";
import ProfileHeader from "@/components/headers/ProfileHeader";
import BundleOrganizer from "@/components/organizer/BundleOrganizer";
import ExpandableText from "@/components/ui/custom/ExpandableText";
import SongsOrganizer from "@/components/organizer/SongsOrganizer";

async function getData(artistId: string) {
  const artistInfo: ArtistType = await fetch(
    `${process.env.URL}/api/artist?id=${artistId}`
  ).then((res) => res.json());

  const albumsBundle: BundleType[] = await fetch(
    `${process.env.URL}/api/album?artistId=${artistId}`
  ).then((res) => res.json());
  const songsData: { songs: SongType[]; hasMore: boolean } = await fetch(
    `${process.env.URL}/api/song?artistId=${artistId}&take=5`
  ).then((res) => res.json());

  return {
    artistInfo,
    songsData,
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
  params: { artistId },
}: {
  params: { artistId: string };
}) {
  const {
    albumsBundle,
    artistInfo,
    songsData: { hasMore, songs },
  } = await getData(artistId);

  if (artistInfo.error) return redirect("404");

  const vibrantColor = await fetch(
    `${process.env.URL}/api/vibrant-color?imgUrl=${encodeURI(artistInfo.cover)}`
  ).then((res) => res.json());

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
    <div className="flex flex-col gap-3 pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80  min-[2000px]:ml-96">
      <ProfileHeader
        username={session?.user.name as string}
        followersLength={followers.length}
        isInclude={followers.isInclude}
        vibrantColor={vibrantColor || "transparent"}
        artistAbout={artistInfo.summary}
        profileInfo={{
          profileId: artistInfo.id,
          profileName: artistInfo.name,
          cover: artistInfo.cover,
        }}
        isArtist
      />
      {songs.length > 0 && <SongsOrganizer songs={songs} title="Musics" />}

      {hasMore && (
        <Button
          asChild
          className="bg-white rounded-lg self-start ml-4 text-black"
        >
          <Link href={`/artist/${artistInfo.id}/musics`}>Show all</Link>
        </Button>
      )}
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

      <div className="p-4 md:hidden">
        <h2 className="text-xl font-kanit">About</h2>
        <ExpandableText>{artistInfo.summary}</ExpandableText>
      </div>
    </div>
  );
}

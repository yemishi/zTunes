"use server";

import Link from "next/link";

import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { ProfileHeader, ErrorWrapper, SongsGrid } from "@/components";
import { ExpandableText, Button } from "@/ui";

import ArtistAlbums from "./ArtistAlbums";

const artistData = async (artistId: string, username: string) => {
  const artist = await fetch(`${process.env.URL}/api/artist?id=${artistId}`).then((res) => res.json());

  if (artist.error) return notFound();
  const followers = await getFollowers(username, artistId);
  return [artist, followers];
};
const getSongs = async (artistId: string) =>
  await fetch(`${process.env.URL}/api/song?artistId=${artistId}&take=5`).then((res) => res.json());

const getFollowers = async (username: string, artistId: string) => {
  const data = await fetch(`${process.env.URL}/api/followers?artistId=${artistId}&username=${username}`).then((res) =>
    res.json()
  );
  return data;
};

export default async function Artist(props: { params: Promise<{ artistId: string }> }) {
  const params = await props.params;

  const { artistId } = params;
  const session = await getServerSession(authOptions);
  const username = session?.user?.name;

  const [[artist, followers], songsData] = await Promise.all([
    artistData(artistId, username || ""),
    getSongs(artistId),
  ]);
  return (
    <div className="flex flex-col gap-3">
      <ProfileHeader
        username={username}
        followersLength={followers.length}
        isInclude={followers.isInclude}
        artistAbout={artist.summary}
        profileInfo={{
          profileId: artist.id,
          profileName: artist.name,
          cover: artist.cover,
          vibrantColor: artist.vibrantColor,
        }}
        isArtist
      />

      <ErrorWrapper error={songsData.error} message={songsData.message}>
        {songsData?.songs?.length > 0 && <SongsGrid username={username} songs={songsData.songs} title="Musics" />}

        {songsData?.hasMore && (
          <Button href={`/artist/${artist.id}/musics`} className="bg-white rounded-lg self-start ml-4">
            See all
          </Button>
        )}
      </ErrorWrapper>
      <Link
        href={`/artist/${artist.id}/discography`}
        className="self-end mr-4 font-kanit text-lg text-white text-opacity-50 underline underline-offset-[6px] hover:text-opacity-100 duration-100"
      >
        See discography
      </Link>
      <ArtistAlbums artistId={artistId} />
      <div className="p-4 md:hidden">
        <h2 className="text-xl font-kanit">About</h2>
        <ExpandableText>{artist.summary}</ExpandableText>
      </div>
    </div>
  );
}

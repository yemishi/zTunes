import { authOptions } from "@/lib/auth";
import { BundleType } from "@/types/response";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import { GenericHeader } from "@/components";
import SongGrid from "../../albumSongsGrid/AlbumSongsGrid";
import DeleteAlbum from "../../deleteAlbum/DeleteAlbum";

async function fetchData(albumId: string, artistName: string) {
  const albumInfo: BundleType & {
    vibrantColor: { color: string; isLight: boolean };
    tracks: { url: string; duration: number }[];
  } = await fetch(`${process.env.URL}/api/album?albumId=${albumId}`).then((res) => res.json());

  if (albumInfo.error || albumInfo.artistName !== artistName) {
    if (albumInfo.status === 404 || albumInfo.artistName !== artistName) return notFound();
    throw new Error(albumInfo.message);
  }

  return albumInfo;
}

export default async function ArtistPage(props: { params: Promise<{ albumId: string }> }) {
  const params = await props.params;

  const { albumId } = params;

  const session = await getServerSession(authOptions);
  const { artistId, artistName, avatar, coverPhoto, title, desc, tracks, releasedDate, vibrantColor } = await fetchData(
    albumId,
    session?.user.name as string
  );

  return (
    <div className="flex flex-col relative">
      <GenericHeader
        vibrantColor={vibrantColor}
        info={{
          avatar,
          title,
          author: artistName,
          authorId: artistId,
          isOwner: true,
          coverPhoto,
          releasedDate,
          desc,
          tracks,
        }}
        extraBody={{ albumId }}
        updateUrl={`/api/album?albumId=${albumId}`}
      />
      <SongGrid albumId={albumId} artistId={artistId}  url={`/api/song?albumId=${albumId}`} />
      <DeleteAlbum albumId={albumId} title={title} />
    </div>
  );
}

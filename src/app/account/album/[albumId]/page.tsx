import { authOptions } from "@/lib/auth";
import { BundleType, ErrorType, SongType } from "@/types/response";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import GenericHeader from "@/app/components/headers/GenericHeader";
import ViewSongsAlbum from "../../components/ViewSongsAlbum";
import DeleteAlbum from "../../components/albumManager/DeleteAlbum";

async function fetchData(albumId: string, artistName: string) {
  const albumInfo: BundleType | ErrorType = await fetch(
    `${process.env.URL}/api/album?albumId=${albumId}`
  ).then((res) => res.json());

  if (albumInfo.error || albumInfo.artistName !== artistName)
    return redirect("404");

  const songs: SongType[] = await fetch(
    `${process.env.URL}/api/song?albumId=${albumId}`
  ).then((res) => res.json());
  return { songs, albumInfo };
}

export default async function ArtistPage({
  params: { albumId },
}: {
  params: { albumId: string };
}) {
  const session = await getServerSession(authOptions);
  const {
    albumInfo: { avatar, title, artistName, artistId, coverPhoto },
    songs,
  } = await fetchData(albumId, session?.user.name as string);
  return (
    <div className="pb-32 flex flex-col relative">
      <GenericHeader
        info={{
          avatar,
          title,
          author: artistName,
          authorId: artistId,
          isOwner: true,
          coverPhoto,
        }}
        updateUrl={`/api/album?albumId=${albumId}`}
        songs={songs}
      />
      <ViewSongsAlbum albumId={albumId} artistId={artistId} songs={songs} />
      <DeleteAlbum albumId={albumId} title={title} />
    </div>
  );
}

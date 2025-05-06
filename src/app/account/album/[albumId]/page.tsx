import { authOptions } from "@/lib/auth";
import { BundleType } from "@/types/response";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import GenericHeader from "@/components/headers/GenericHeader";
import ViewSongsAlbum from "../../components/ViewSongsAlbum";
import DeleteAlbum from "../../components/albumManager/DeleteAlbum";

async function fetchData(albumId: string, artistName: string) {
  const albumInfo: BundleType & { urlsSongs: string[] } = await fetch(
    `${process.env.URL}/api/album?albumId=${albumId}`
  ).then((res) => res.json());

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
  const { artistId, artistName, avatar, coverPhoto, title, desc, urlsSongs, releasedDate } = await fetchData(
    albumId,
    session?.user.name as string
  );

  return (
    <div className="pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80  min-[2000px]:ml-96 flex flex-col relative">
      <GenericHeader
        info={{
          avatar,
          title,
          author: artistName,
          authorId: artistId,
          isOwner: true,
          coverPhoto,
          releasedDate,
          desc,
          urlsSongs,
        }}
        updateUrl={`/api/album?albumId=${albumId}`}
      />
      <ViewSongsAlbum albumId={albumId} artistId={artistId} url={`/api/song?albumId=${albumId}`} />
      <DeleteAlbum albumId={albumId} title={title} />
    </div>
  );
}

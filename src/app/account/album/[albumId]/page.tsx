import { authOptions } from "@/lib/auth";
import { BundleType, ErrorType } from "@/types/response";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import GenericHeader from "@/components/headers/GenericHeader";
import ViewSongsAlbum from "../../components/ViewSongsAlbum";
import DeleteAlbum from "../../components/albumManager/DeleteAlbum";

async function fetchData(albumId: string, artistName: string) {
  const albumInfo: (BundleType & { urlsSongs: string[] }) | ErrorType =
    await fetch(`${process.env.URL}/api/album?albumId=${albumId}`).then((res) =>
      res.json()
    );

  if (albumInfo.error || albumInfo.artistName !== artistName)
    return redirect("404");

  return albumInfo;
}

export default async function ArtistPage({
  params: { albumId },
}: {
  params: { albumId: string };
}) {
  const session = await getServerSession(authOptions);
  const {
    artistId,
    artistName,
    avatar,
    coverPhoto,
    title,
    desc,
    urlsSongs,
    releasedDate,
  } = await fetchData(albumId, session?.user.name as string);

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
      <ViewSongsAlbum
        albumId={albumId}
        artistId={artistId}
        url={`/api/song?albumId=${albumId}`}
      />
      <DeleteAlbum albumId={albumId} title={title} />
    </div>
  );
}

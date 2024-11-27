import GenericHeader from "@/components/headers/GenericHeader";
import SongsQueryOrganizer from "@/components/organizer/SongsQueryOrganizer";
import { notFound } from "next/navigation";

async function fetchData(albumId: string) {
  const albumInfo =
    await fetch(`${process.env.URL}/api/album?albumId=${albumId}`).then((res) => res.json());

  if (albumInfo.error) {
    if (albumInfo.status === 404) return notFound()
    throw new Error(albumInfo.message);
  }
  return albumInfo;
}

export default async function Album({
  params: { albumId },
}: {
  params: { albumId: string };
}) {
  const albumInfo = await fetchData(albumId);

  const {
    artistId,
    artistName,
    coverPhoto,
    releasedDate,
    title,
    avatar,
    desc,
    id,
    urlsSongs,
  } = albumInfo;

  return (
    <div className="flex flex-col pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      <GenericHeader
        info={{
          isOwner: false,
          authorId: artistId,
          author: artistName,
          avatar: avatar as string,
          coverPhoto,
          title,
          urlsSongs,
          desc,
          releasedDate,
        }}
      />
      <SongsQueryOrganizer
        asOl
        queryKey={["Songs", id]}
        url={`/api/song?albumId=${albumId}`}
      />
    </div>
  );
}

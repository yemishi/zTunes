import GenericHeader from "@/components/headers/GenericHeader";
import SongsQueryOrganizer from "@/components/songsGrid/songsGridQuery/SongsGridQuery";

import { notFound } from "next/navigation";

async function fetchData(albumId: string) {
  const albumInfo = await fetch(`${process.env.URL}/api/album?albumId=${albumId}`, { cache: "no-store" }).then((res) =>
    res.json()
  );

  if (albumInfo.error) {
    if (albumInfo.status === 404) return notFound();
    throw new Error(albumInfo.message);
  }
  return albumInfo;
}

export default async function Album(props: { params: Promise<{ albumId: string }> }) {
  const params = await props.params;

  const { albumId } = params;

  const albumInfo = await fetchData(albumId);

  const { artistId, artistName, coverPhoto, releasedDate, title, avatar, desc, id, urlsSongs } = albumInfo;

  return (
    <div className="flex flex-col">
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
      <SongsQueryOrganizer asOl queryKey={["Songs", id]} url={`/api/song?albumId=${albumId}`} />
    </div>
  );
}

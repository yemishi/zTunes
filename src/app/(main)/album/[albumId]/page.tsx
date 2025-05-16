import { SongsGridQuery, GenericHeader } from "@/components";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

import { notFound } from "next/navigation";

async function fetchData(albumId: string) {
  const albumInfo = await fetch(`${process.env.URL}/api/album?albumId=${albumId}`).then((res) => res.json());

  if (albumInfo.error) {
    if (albumInfo.status === 404) return notFound();
    throw new Error(albumInfo.message);
  }
  return albumInfo;
}

export default async function Album(props: { params: Promise<{ albumId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  const { albumId } = params;

  const albumInfo = await fetchData(albumId);

  const { artistId, artistName, coverPhoto, releasedDate, title, avatar, desc, id, tracks, vibrantColor } = albumInfo;

  return (
    <div className="flex flex-col">
      <GenericHeader
        vibrantColor={vibrantColor}
        updateUrl={`/api/album?albumId=${albumId}`}
        info={{
          isOwner: false,
          authorId: artistId,
          author: artistName,
          avatar: avatar as string,
          coverPhoto,
          title,
          tracks,
          desc,
          releasedDate,
        }}
      />
      <SongsGridQuery
        username={session?.user.name}
        asOl
        queryKey={["Songs", id]}
        url={`/api/song?albumId=${albumId}`}
      />
    </div>
  );
}

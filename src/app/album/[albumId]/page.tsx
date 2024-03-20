import GenericHeader from "@/app/components/headers/GenericHeader";
import SongsOrganizer from "@/app/components/organizer/SongsOrganizer";
import { BundleType, ErrorType, SongType } from "@/types/response";
import { redirect } from "next/navigation";
async function fetchData(albumId: string) {
  try {
    const album: BundleType | ErrorType = await fetch(
      `${process.env.URL}/api/album?albumId=${albumId}`,
      { cache: "no-store" }
    ).then((res) => res.json());

    const songs: SongType[] = await fetch(
      `${process.env.URL}/api/song?albumId=${albumId}`,
      { cache: "no-store" }
    ).then((res) => res.json());

    const validSongs: SongType[] = songs.filter((song) => !song.error);

    if (album.error) return redirect("404");
    return {
      album,
      songs: validSongs,
    };
  } catch (error) {
    return redirect("404");
  }
}

export default async function Album({
  params,
}: {
  params: { albumId: string };
}) {
  const data = await fetchData(params.albumId);

  if (!data) return redirect("404");

  const { album, songs } = data;
  const { artistId, artistName, coverPhoto, releasedDate, title, avatar } =
    album;
  console.log(coverPhoto);
  return (
    <div className="flex flex-col pb-32">
      <GenericHeader
        songs={songs}
        info={{
          isOwner: false,
          authorId: artistId,
          author: artistName,
          avatar: avatar as string,
          coverPhoto,
          title,
          releasedDate,
        }}
      />
      <SongsOrganizer songs={songs} />
    </div>
  );
}

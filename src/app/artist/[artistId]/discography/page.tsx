import SongsOrganizer from "@/app/components/organizer/SongsOrganizer";
import Image from "@/app/components/ui/Image";
import Play from "@/app/components/ui/Play";
import { BundleType, SongType } from "@/types/response";
import Link from "next/link";

async function fetchData(artistId: string) {
  const albums: BundleType[] = await fetch(
    `${process.env.URL}/api/album?artistId=${artistId}`
  ).then((res) => res.json());

  const fetchSongs = async (albumId: string): Promise<SongType[]> =>
    await fetch(`${process.env.URL}/api/song?albumId=${albumId}`).then((res) =>
      res.json()
    );

  const songs = await Promise.all(albums.map((album) => fetchSongs(album.id)));

  return {
    songs,
    albums,
  };
}

export default async function Discography({
  params,
}: {
  params: { artistId: string };
}) {
  const { albums, songs } = await fetchData(params.artistId);

  return (
    <div className="flex flex-col">
      <Link
        href={`/artist/${params.artistId}`}
        className="p-4 first-letter:uppercase font-kanit text-lg sticky top-0 bg-[#121212] shadow-md shadow-black"
      >
        {albums[0].artistName}
      </Link>

      <div className="flex flex-col gap-5 ">
        {albums.map((album, index) => {
          const { title, type, releasedDate, coverPhoto } = album;
          const albumSongs = songs.flatMap((song) =>
            song.filter((song) => song.albumId === album.id)
          );

          return (
            <div key={`${album.id}_${index}`} className="flex flex-col">
              <div className=" w-full flex gap-2 p-4">
                <Image src={coverPhoto} className="size-32 rounded" />
                <div className="flex flex-col gap-2 font-kanit">
                  <span className="text-2xl">{title}</span>

                  <div className="flex gap-1 text-gray-300 font-light">
                    <span className="first-letter:uppercase">{type}</span>•
                    <span>{releasedDate?.split("/")[2]}</span>•
                    <span>{albumSongs.length} songs</span>
                  </div>
                  <Play className="mt-auto p-0" songs={albumSongs} />
                </div>
              </div>
              <SongsOrganizer asOl songs={albumSongs} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

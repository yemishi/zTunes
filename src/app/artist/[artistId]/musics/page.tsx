"use server";

import SongsOrganizer from "@/app/components/organizer/SongsOrganizer";
import PreviousPage from "@/app/components/ui/buttons/PreviousPage";
import { getVibrantColor } from "@/app/utils/fnc";
import { SongType } from "@/types/response";

async function fetchData(artistId: string) {
  const data: SongType[] = await fetch(
    `${process.env.URL}/api/song?artistId=${artistId}&getAll=true`
  ).then((res) => res.json());

  return data;
}
export default async function Musics({
  params,
}: {
  params: { artistId: string };
}) {
  const songs = await fetchData(params.artistId);
  const vibrantColor = (await getVibrantColor(songs[0].coverPhoto))?.default;
  return (
    <div className="flex flex-col gap-3 ">
      <div
        style={{
          background: `linear-gradient(to bottom,${
            vibrantColor || "transparent"
          } 0%, transparent) 100%`,
        }}
        className="flex flex-col p-2 pb-5"
      >
        <PreviousPage />
        <h1 className="font-kanit text-2xl ml-4">Musics</h1>
      </div>
      <div className="p-2 flex flex-col ">
        <SongsOrganizer songs={songs} />
      </div>
    </div>
  );
}

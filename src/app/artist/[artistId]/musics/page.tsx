"use client";

import SongsOrganizer from "@/components/organizer/SongsOrganizer";
import PreviousPage from "@/components/ui/buttons/PreviousPage";

export default function Musics({
  params: { artistId },
}: {
  params: { artistId: string };
}) {
  return (
    <div className="flex flex-col gap-3 pb-32 md:pb-20 md:pl-64 lg:ml-72 2xl:ml-80  min-[2000px]:ml-96">
      <div className="flex flex-col p-2 pb-5">
        <PreviousPage />
        <h1 className="font-kanit text-2xl ml-4">Musics</h1>
      </div>
      <div className="p-2 flex flex-col ">
        <SongsOrganizer
          queryKey={["Songs", artistId]}
          url={`/api/song?artistId=${artistId}`}
        />
      </div>
    </div>
  );
}

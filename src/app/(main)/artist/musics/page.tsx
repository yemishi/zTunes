"use client";
import { use } from "react";

import { SongsGridQuery } from "@/components";
import { PreviousPage } from "@/ui";

export default function Musics(props: { params: Promise<{ artistId: string }> }) {
  const params = use(props.params);

  const { artistId } = params;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col p-2 pb-5">
        <PreviousPage />
        <h1 className="font-kanit text-2xl ml-4">Musics</h1>
      </div>
      <div className="p-2 flex flex-col ">
        <SongsGridQuery queryKey={["Songs", artistId]} url={`/api/song?artistId=${artistId}`} />
      </div>
    </div>
  );
}

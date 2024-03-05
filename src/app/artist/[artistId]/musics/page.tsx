"use server";
import SongsOrganizer from "@/app/components/organizer/SongsOrganizer";
import PreviousPage from "@/app/components/ui/PreviousPage";

async function fetchData(artistId: string) {
  const data = await fetch(
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
  return (
    <div className="flex flex-col p-2 gap-3">
      <PreviousPage />
      <h1 className="font-kanit text-2xl ml-4">Musics</h1>
      <SongsOrganizer songs={songs} />
    </div>
  );
}

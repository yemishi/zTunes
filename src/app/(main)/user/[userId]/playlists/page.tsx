"use client";
import { use } from "react";
import Card from "@/components/card/Card";
import PreviousPage from "@/ui/buttons/PreviousPage";
import useScrollQuery from "@/hooks/useScrollQuery/useScrollQuery";
import { BundleType } from "@/types/response";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import UserPlaylistLoading from "./loading";

export default function PlaylistsUser(props: { params: Promise<{ userId: string }> }) {
  const params = use(props.params);

  const { userId } = params;

  const { data: session } = useSession();
  const username = session?.user.name;

  const { error, values, isFetchingNextPage, isLoading, isError, hasNextPage, ref } = useScrollQuery<BundleType>({
    queryKey: ["playlists", username as string],
    url: `/api/playlist?authorId=${userId}&username=${username}`,
  });

  if (error || isError) return redirect("404");
  if (isLoading) return <UserPlaylistLoading />;
  return (
    <div className="px-2 pb-32 flex flex-col gap-3 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96 ">
      <PreviousPage />

      <h1 className="text-2xl font-kanit ml-2">Playlists</h1>
      <div className="flex flex-wrap gap-3 justify-evenly">
        {values.map((playlist, index) => {
          const { artistId, artistName, coverPhoto, id, title, isOfficial } = playlist;
          return (
            <Card
              key={`${id}_${index}`}
              isOfficial={!!isOfficial}
              artistId={artistId}
              artistName={artistName}
              coverPhoto={coverPhoto}
              title={title}
              url={`/playlist/${id}`}
            />
          );
        })}
      </div>
      {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
      {isFetchingNextPage && <div className="spinner" />}
    </div>
  );
}

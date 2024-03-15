"use client";
import Card from "@/app/components/card/Card";
import PreviousPage from "@/app/components/ui/buttons/PreviousPage";
import useScrollQuery from "@/hooks/useScrollQuery";
import { BundleType } from "@/types/response";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function PlaylistsUser({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const { data: session } = useSession();
  const username = session?.user.name;

  const {
    error,
    values,
    isFetchingNextPage,
    isLoading,
    isError,
    hasNextPage,
    ref,
  } = useScrollQuery<BundleType>({
    queryKey: ["playlists", username as string],
    url: `/api/playlist?authorId=${userId}&username=${username}`,
  });

  if (error || isError) return redirect("404");
  return (
    <div className="px-2 pb-32 flex flex-col gap-3 ">
      <PreviousPage />

      <h1 className="text-2xl font-kanit ml-2">Playlists</h1>
      <div className="flex flex-wrap gap-3 justify-evenly">
        {values.map((playlist, index) => {
          const { artistId, artistName, coverPhoto, id, title, isOfficial } =
            playlist;
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
      {isFetchingNextPage && isLoading && <div className="spinner" />}
    </div>
  );
}

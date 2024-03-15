"use client";

import ProfileCard from "@/app/components/card/ProfileCard";
import PreviousPage from "@/app/components/ui/buttons/PreviousPage";
import useScrollQuery from "@/hooks/useScrollQuery";

export default function FollowsPage({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const { values, isFetchingNextPage, hasNextPage, isLoading, ref } =
    useScrollQuery<FollowsType>({
      queryKey: ["Follows"],
      url: `/api/user?userId=${userId}&getFollows=true`,
    });

  return (
    <div className="px-2 pb-32 flex flex-col gap-3 ">
      <PreviousPage />
      <h1 className="text-2xl font-kanit ml-2">Follows</h1>
      <div className="flex flex-wrap gap-3 justify-evenly">
        {values.map((follow, index) => {
          return <ProfileCard key={`${follow.id}_${index}`} props={follow} />;
        })}
      </div>
      {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
      {isFetchingNextPage && isLoading && <div className="spinner" />}
    </div>
  );
}

interface FollowsType {
  id: string;
  name: string;
  cover: string;
  isArtist: boolean;
}

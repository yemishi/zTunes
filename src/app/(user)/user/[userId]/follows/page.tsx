"use client";
import { use } from "react";

import ProfileCard from "@/components/card/ProfileCard";
import PreviousPage from "@/ui/buttons/PreviousPage";
import useScrollQuery from "@/hooks/useScrollQuery";
import UserFollowsLoading from "./loading";

export default function FollowsPage(props0: { params: Promise<{ userId: string }> }) {
  const params = use(props0.params);

  const { userId } = params;

  const { values, isFetchingNextPage, hasNextPage, isLoading, ref } = useScrollQuery<FollowsType>({
    queryKey: ["Follows"],
    url: `/api/user?userId=${userId}&getFollows=true`,
  });
  if (isLoading) return <UserFollowsLoading />;

  return (
    <div className="px-2 pb-32 md:ml-64 flex flex-col gap-3 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      <PreviousPage />
      <h1 className="text-2xl font-kanit ml-2">Follows</h1>
      <div className="flex flex-wrap gap-3 justify-evenly">
        {values.map((follow, index) => {
          return <ProfileCard key={`${follow.id}_${index}`} props={follow} />;
        })}
      </div>
      {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
      {isFetchingNextPage && <div className="spinner" />}
    </div>
  );
}

interface FollowsType {
  id: string;
  name: string;
  cover: string;
  isArtist: boolean;
}

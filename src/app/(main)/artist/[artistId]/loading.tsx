"use client";

import SongOptionsSkeleton from "@/components/skeletons/SongSkeleton";
import BundleStackSkeleton from "@/components/skeletons/bundle/BundleStackSkeleton";

import { PreviousPage } from "@/ui";
import Skeleton from "react-loading-skeleton";

export default function () {
  return (
    <div className="flex flex-col gap-3 p-4 pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      <ArtistHeader />
      <Skeleton className="!w-20 !h-5 md:!h-8 !rounded-xl" />
      {Array.from({ length: 5 }).map((_, index) => (
        <SongOptionsSkeleton key={index} />
      ))}
      <BundleStackSkeleton count={10} />
      <Skeleton className="!w-20 !h-5 md:!h-8 !rounded-xl" />
      <Skeleton className="md:hidden !h-11 !w-80 !ml-4 " />
    </div>
  );
}

const ArtistHeader = () => (
  <div className="flex flex-col  gap-2 items-center w-full pb-10 md:h-[480px] md:items-start ">
    <PreviousPage className="pointer-events-none animate-pulse " />
    <div className="flex flex-col md:flex-row w-full items-center md:items-start gap-3 md:mt-auto">
      <Skeleton className="!size-44 !rounded-full md:!hidden" />
      <div className="flex flex-col gap-1 items-center md:mt-auto md:mb-5 md:items-start">
        <Skeleton className="!w-40 !h-8 !rounded-lg md:!w-72 md:!h-16" />
        <Skeleton className="!w-20 !h-5 md:!h-8 !rounded-xl" />
      </div>
    </div>
    <Skeleton className="max-md:hidden !h-11 !w-80 !ml-4 " />
  </div>
);

import SongSkeleton from "@/components/skeletons/SongSkeleton";
import { PreviousPage } from "@/ui";
import Skeleton from "react-loading-skeleton";

export default function () {
  return (
    <div className="flex flex-col">
      <div className="p-2 flex flex-col gap-4 mb-3">
        <PreviousPage className="pointer-events-none animate-pulse" />
        <Skeleton className="!w-24 !h-8" />
      </div>
      {Array.from({ length: 10 }).map((_, index) => (
        <SongSkeleton key={index} />
      ))}
    </div>
  );
}

import SongSkeleton from "@/components/skeletons/SongSkeleton";
import PreviousPage from "@/ui/buttons/PreviousPage";
import Skeleton from "react-loading-skeleton";

export default function () {
  return (
    <div className="flex flex-col pb-32 md:pb-20 md:pl-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96 p-2">
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

import SongSkeleton from "@/components/skeletons/SongSkeleton";
import Skeleton from "react-loading-skeleton";

export default function () {
  return (
    <div className="flex flex-col">
      <div className="h-[60px] w-full p-4 shadow-md shadow-black">
        <Skeleton className="!h-full !w-64" />
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3 p-2">
          <AlbumInfo />
          {Array.from({ length: 5 }).map((_, index) => (
            <SongSkeleton key={index} asOl />
          ))}
        </div>
      ))}
    </div>
  );
}

const AlbumInfo = () => (
  <div className="flex gap-1 items-center p-2">
    <Skeleton className="!size-32 md:!size-52 !rounded-lg" />
    <div className="flex flex-col gap-2">
      <Skeleton className="!w-52 !h-7" />
      <Skeleton className="!w-48 !h-5" />
    </div>
  </div>
);

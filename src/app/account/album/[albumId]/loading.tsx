import GenericHeaderSkeleton from "@/components/skeletons/GenericHeaderSkeleton";
import Skeleton from "react-loading-skeleton";

export default function () {
  return (
    <div className="pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80  min-[2000px]:ml-96 flex flex-col">
      <GenericHeaderSkeleton />
      <div className="flex flex-col p-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <SongAlbum key={index} />
        ))}
      </div>
    </div>
  );
}
const SongAlbum = () => (
  <div className="flex items-center w-full justify-between p-2">
    <div className="flex gap-2">
      <Skeleton className="!h-7 !w-2" />
      <Skeleton className="!h-7 !w-11" />
    </div>
    <Skeleton className="!h-9 !w-16 !rounded-lg" />
  </div>
);

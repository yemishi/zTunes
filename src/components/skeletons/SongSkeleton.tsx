import Skeleton from "react-loading-skeleton";

export default function SongSkeleton({ asOl }: { asOl?: boolean }) {
  return (
    <div className="flex items-center p-2  md:grid md:grid-cols-3 md:max-w-[1900px]">
      <div className="flex gap-1 items-center">
        {asOl ? (
          <Skeleton className="!h-6 !w-2" />
        ) : (
          <Skeleton className="!size-12 !rounded-lg" />
        )}
        <Skeleton count={2} className="!w-32 !h-4 !rounded-lg" />
      </div>
      <Skeleton className="max-md:!hidden !w-52" />

      <div className="flex gap-4 ml-auto items-center">
        <Skeleton className="max-md:!hidden !w-20 " />
        <Skeleton className="max-md:!hidden !size-8 !rounded-full" />
        <Skeleton className="!h-9 !w-2" />
      </div>
    </div>
  );
}

import Skeleton from "react-loading-skeleton";

export default function ProfileCardSkeleton() {
  return (
    <div
      className="flex flex-col items-center px-4 py-2 justify-between w-44 h-52 md:py-5 md:bg-black-500 md:w-60 md:min-w-52 md:h-64 
      rounded-lg hover:bg-black-450 active:bg-black-450"
    >
      <Skeleton className="!h-36 !w-36 md:!w-44 md:!h-44 !rounded-full" />
      <Skeleton />
      <Skeleton width={150} borderRadius={8} />
    </div>
  );
}

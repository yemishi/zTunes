import Skeleton from "react-loading-skeleton";

export default function () {
  return (
    <>
      <span className="self-end md:self-start">
        <Skeleton className="!w-40 !h-9 md:!w-52 md:!h-11 !rounded-full" />
      </span>
      <div className="flex flex-col gap-3 p-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <SearchCard key={index} />
        ))}
      </div>
    </>
  );
}

const SearchCard = () => (
  <div className="flex justify-between items-center">
    <div className="flex gap-2">
      <Skeleton className="!size-12 md:!size-16 !rounded-lg" />

      <div className="flex flex-col">
        <Skeleton className="!w-36 !h-7" />
        <Skeleton className="!w-24 !h-5" />
      </div>
    </div>
    <Skeleton className="!h-7 !w-3" />
  </div>
);

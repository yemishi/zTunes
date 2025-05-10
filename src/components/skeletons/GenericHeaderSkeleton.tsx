import PreviousPage from "@/ui/buttons/PreviousPage";
import Skeleton from "react-loading-skeleton";

export default function GenericHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2 items-center w-full p-4 pb-10 md:h-[350px] md:items-start">
      <PreviousPage className="pointer-events-none animate-pulse " />
      <div className="flex flex-col md:p-4 md:flex-row w-full items-center md:items-start  gap-3">
        <Skeleton className="!rounded-lg !size-44 md:!size-52 !self-center md:!self-start" />

        <div className="flex flex-col md:mt-auto w-full">
          <span className="self-center text-center md:self-start md:text-start md:pb-4 ">
            <Skeleton className="!h-11 !w-44" />
            <Skeleton className="!w-24" />
          </span>

          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2 font-kanit text-sm md:text-base">
            <div className="flex items-center gap-1 ">
              <Skeleton className="!size-7 md:!size-10 !rounded-full" />
              <Skeleton className="!w-20 md:!p-1" />
            </div>
            <Skeleton className="!w-36 md:!p-1" />
          </div>
          <Skeleton className="!h-11 !w-full" />
        </div>
      </div>
    </div>
  );
}

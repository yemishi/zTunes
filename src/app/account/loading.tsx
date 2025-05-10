import PreviousPage from "@/ui/buttons/PreviousPage";
import Skeleton from "react-loading-skeleton";

export default function () {
  return (
    <div className="flex flex-col gap-4 pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96 max-w-7xl">
      <AccHeader />
      <Card />
      <Card />
    </div>
  );
}
const Card = () => (
  <div className="flex p-2 w-full items-center justify-between">
    <div className="flex gap-2">
      <Skeleton className="!size-9 !rounded-lg md:!size-11" />
      <span className="flex flex-col">
        <Skeleton className="!h-7 !w-16 md:!w-20 !rounded-lg" />
        <Skeleton className="!h-4 !w-40 md:!w-44 !rounded-lg" />
      </span>
    </div>
    <Skeleton className="!size-9 !rounded-lg" />
  </div>
);

const AccHeader = () => (
  <div className="flex flex-col  gap-2 items-center w-full p-4 pb-10 md:h-[350px]  md:items-start ">
    <PreviousPage className="pointer-events-none animate-pulse " />
    <div className="flex flex-col md:p-4 md:flex-row w-full items-center md:items-start  gap-3 md:mt-auto">
      <Skeleton className="!size-44 !rounded-full" />
      <div className="flex flex-col gap-1 items-center md:mt-auto md:mb-5 md:items-start md:pb-6">
        <Skeleton className="!w-40 !h-8 !rounded-lg md:!w-72 md:!h-16" />
      </div>
    </div>
  </div>
);

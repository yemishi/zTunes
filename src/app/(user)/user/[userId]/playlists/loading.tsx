import CardSkeleton from "@/components/skeletons/card/CardSkeleton";
import PreviousPage from "@/components/ui/buttons/PreviousPage";
import Skeleton from "react-loading-skeleton";

export default function () {
  return (
    <div className="pb-32 flex flex-col gap-3 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96 p-2">
      <PreviousPage className="pointer-events-none animate-pulse p-2" />

      <Skeleton
        width={150}
        height={25}
        borderRadius={7}
        className="!mt-4 ml-2"
      />
      <div className="flex flex-wrap gap-3 justify-evenly">
        {Array.from({ length: 10 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

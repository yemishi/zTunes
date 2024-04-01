import Skeleton from "react-loading-skeleton";

export default function CardSkeleton() {
  return (
    <div className=" w-44 h-[200px] md:bg-black-500 rounded-lg md:h-[288px] md:min-w-52 md:w-60 flex flex-col md:p-3 gap-1">
      <Skeleton className="!h-[160px] !rounded-xl md:!rounded-lg md:!h-[208px]  " />
      <Skeleton width={130}  className="!ml-1 !rounded-lg" />
      <Skeleton width={110} className="!hidden md:!flex !ml-1 !rounded-lg" />
    </div>
  );
}

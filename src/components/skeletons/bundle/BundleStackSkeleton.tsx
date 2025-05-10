import Skeleton from "react-loading-skeleton";
import CardSkeleton from "../card/CardSkeleton";
import { Slider } from "@/components";

export default function BundleStackSkeleton({ count }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Skeleton width={150} height={17} borderRadius={7} />
      <Slider>
        {Array.from({ length: count || 2 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </Slider>
    </div>
  );
}

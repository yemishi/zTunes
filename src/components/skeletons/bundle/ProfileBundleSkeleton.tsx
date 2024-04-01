import Skeleton from "react-loading-skeleton";
import Slider from "../../Slider/Slider";
import ProfileCardSkeleton from "../card/ProfileCardSkeleton";

export default function ProfileBundleSkeleton({ count }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <Skeleton width={150} height={17} borderRadius={7} />
      <Slider>
        {Array.from({ length: count || 2 }).map((_, index) => (
          <ProfileCardSkeleton key={index} />
        ))}
      </Slider>
    </div>
  );
}

import BundleStackSkeleton from "@/components/skeletons/bundle/BundleStackSkeleton";
import ProfileBundleSkeleton from "@/components/skeletons/bundle/ProfileBundleSkeleton";

import PreviousPage from "@/components/ui/buttons/PreviousPage";
import Skeleton from "react-loading-skeleton";

export default function () {
  return (
    <div className="flex flex-col gap-4 pb-32 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      <UserHeader />
      <BundleStackSkeleton count={10} />
      <ProfileBundleSkeleton count={10} />
    </div>
  );
}

const UserHeader = () => (
  <div className="flex flex-col  gap-2 items-center w-full p-4 pb-10 md:h-[350px]  md:items-start ">
    <PreviousPage className="pointer-events-none animate-pulse " />
    <div className="flex flex-col md:p-4 md:flex-row w-full items-center md:items-start  gap-3 md:mt-auto">
      <Skeleton className="!size-44 !rounded-full" />
      <div className="flex flex-col gap-1 items-center md:mt-auto md:mb-5 md:items-start">
        <Skeleton className="!w-40 !h-8 !rounded-lg md:!w-52 md:!h-16" />
        <Skeleton className="!w-20 !h-10 !rounded-xl" />
      </div>
    </div>
  </div>
);

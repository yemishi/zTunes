import BundleStackSkeleton from "@/components/skeletons/bundle/BundleStackSkeleton";
import ProfileStackSkeleton from "@/components/skeletons/bundle/ProfileBundleSkeleton";

export default function () {
  return (
    <div className="flex flex-col pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      <BundleStackSkeleton count={10} />
      <BundleStackSkeleton count={10} />
      <ProfileStackSkeleton count={10} />
    </div>
  );
}

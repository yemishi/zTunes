import BundleStackSkeleton from "@/components/skeletons/bundle/BundleStackSkeleton";
import ProfileStackSkeleton from "@/components/skeletons/bundle/ProfileBundleSkeleton";

export default function () {
  return (
    <div className="flex flex-col">
      <BundleStackSkeleton count={10} />
      <BundleStackSkeleton count={10} />
      <ProfileStackSkeleton count={10} />
    </div>
  );
}

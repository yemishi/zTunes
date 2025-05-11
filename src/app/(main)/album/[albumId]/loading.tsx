import SongOptionsSkeleton from "@/components/skeletons/SongSkeleton";
import GenericHeaderSkeleton from "@/components/skeletons/GenericHeaderSkeleton";

export default function () {
  return (
    <div className="flex flex-col">
      <GenericHeaderSkeleton />
      {Array.from({ length: 10 }).map((_, index) => (
        <SongOptionsSkeleton key={index} />
      ))}
    </div>
  );
}

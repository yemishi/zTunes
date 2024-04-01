import SongOptionsSkeleton from "@/components/skeletons/SongSkeleton";
import GenericHeaderSkeleton from "@/components/skeletons/GenericHeaderSkeleton";

export default function() {
  return (
    <div className="flex flex-col pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96 ">
      <GenericHeaderSkeleton />
      {Array.from({ length: 10 }).map((_, index) => (
        <SongOptionsSkeleton key={index} />
      ))}
    </div>
  );
}

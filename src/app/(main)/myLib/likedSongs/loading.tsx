import SongSkeleton from "@/components/skeletons/SongSkeleton";

export default function () {
  return <div className="w-full flex flex-col gap-2">
    {Array.from({length:10}).map((_,index)=> <SongSkeleton key={index}/>)}
  </div>;
}

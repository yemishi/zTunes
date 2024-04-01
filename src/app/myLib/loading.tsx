import CardSkeleton from "@/components/skeletons/card/CardSkeleton";

export default function LibLoading() {
  return (
    <div className="flex flex-wrap w-full gap-4 justify-center">
      {Array.from({ length: 10 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

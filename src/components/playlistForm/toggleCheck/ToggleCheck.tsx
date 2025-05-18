export default function ToggleCheck({
  isActive,
  title,
  desc,
  toggle,
}: {
  isActive: boolean;
  desc: string;
  title: string;
  toggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between sm:items-end sm:self-end w-full gap-5">
      <div className="flex flex-col">
        <span className="text-lg">{title}</span>
        <span className="font-semibold">{desc}</span>
      </div>

      <span
        onClick={toggle}
        className={`w-14 h-7 rounded-full self-center relative after:absolute after:h-5/6 after:w-6 after:top-2/4 after:-translate-y-2/4 after:bg-white 
    after:rounded-full duration-200 after:duration-200 cursor-pointer ${
      isActive ? "bg-orange-400 after:left-2/4" : "bg-black/50 after:left-1"
    }`}
      />
    </div>
  );
}

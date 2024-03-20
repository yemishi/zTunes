import { useRouter } from "next/navigation";
import { memo } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

const hasPrevious = typeof window !== "undefined" && window.history?.length;

function PreviousPage({ ...props }: DivProps) {
  const { back } = useRouter();

  return (
    <div
      {...props}
      className={`w-full ${props.className ? props.className : ""} ${
        props.className?.includes("p") ? "" : "py-4 pl-2"
      }`}
    >
      <IoArrowBackOutline
        onClick={() => (hasPrevious ? back() : null)}
        className={`size-7 text-white`}
      />
    </div>
  );
}

export default memo(PreviousPage);

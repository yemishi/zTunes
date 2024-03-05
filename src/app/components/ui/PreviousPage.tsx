"use client";
import { useRouter } from "next/navigation";

import { IoArrowBackOutline } from "react-icons/io5";
export default function PreviousPage() {
  const { back } = useRouter();
  return (
    <div className="w-full py-4">
      <IoArrowBackOutline onClick={back} className="size-7 ml-2" />
    </div>
  );
}

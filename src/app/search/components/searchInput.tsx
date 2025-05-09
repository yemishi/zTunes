"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PreviousPage from "@/ui/buttons/PreviousPage";

export default function SearchInput() {
  const { push } = useRouter();
  const [search, setSearch] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, " ");
    setSearch(value);
    if (!value) {
      console.log(value), push("/search");
    }
    push(`/search?q=${value}`);
  };

  return (
    <div className="bg-black-400 flex justify-between items-center sticky top-0">
      <span>
        <PreviousPage />
      </span>
      <input
        autoFocus
        className="w-full p-2 bg-transparent outline-none md:text-lg "
        value={search}
        onChange={onChange}
      />
      <span
        onClick={() => {
          setSearch(""), push("/search");
        }}
        className="font-montserrat text-2xl mx-4 cursor-pointer"
      >
        X
      </span>
    </div>
  );
}

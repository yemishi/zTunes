"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PreviousPage } from "@/ui";
import { TiDelete } from "react-icons/ti";

export default function SearchInput() {
  const { push } = useRouter();
  const [search, setSearch] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, " ");
    setSearch(value);
    if (!value) {
      push("/search");
      return;
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
        className="w-full p-2 bg-transparent outline-none md:text-lg md:rounded-lg"
        value={search}
        onChange={onChange}
      />

      <button
        onClick={() => {
          setSearch(""), push("/search");
        }}
        className={`${search ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all  ml-auto rounded-lg self-center font-kanit text-xl md:text-2xl cursor-pointer
         hover:brightness-90 active:brightness-110 `}
      >
        <TiDelete className="size-9" />
      </button>
    </div>
  );
}

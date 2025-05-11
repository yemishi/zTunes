"use client";

import { Button } from "@/ui";
import { SearchType } from "../page";
import CardSearch from "./cardSearch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorType } from "@/types/response";
import { toast } from "react-toastify";

export default function HistoricSearch({ historic, username }: { username: string; historic: SearchType[] }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { refresh } = useRouter();
  const resetHistoric = async () => {
    const body = { username, action: "reset" };
    setIsLoading(true);
    const response: ErrorType = await fetch(`/api/search`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    if (response.error) return toast.error(response.message), setIsLoading(false);
    refresh(), setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        isLoading={isLoading}
        onClick={resetHistoric}
        className="bg-transparent self-end text-gray-300 mr-2 text-sm md:text-lg md:self-start"
      >
        Clear search historic
      </Button>
      {historic.map((info, index) => {
        return (
          <CardSearch isLoading={isLoading} key={`${info.refId}_${index}`} username={username} data={info} isHistoric />
        );
      })}
    </div>
  );
}

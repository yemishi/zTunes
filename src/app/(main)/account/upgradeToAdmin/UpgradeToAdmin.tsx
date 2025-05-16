"use client";

import { ErrorType } from "@/types/response";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CardAcc from "../cardAcc/CardAcc";
import { useState } from "react";
import { PopConfirm } from "@/components";

export default function UpgradeToAdmin({ userId }: { userId: string }) {
  const { refresh } = useRouter();
  const [isPopUp, setIsPopUp] = useState(false);
  const upgrade = async () => {
    const response: ErrorType = await fetch(`/api/user/upgrade?field=admin`, {
      method: "PATCH",
      body: JSON.stringify({ userId }),
    }).then((res) => res.json());
    if (response.error) return toast.error(response.message);
    toast.success(response.message);
    return refresh();
  };

  return (
    <>
      <CardAcc onClick={() => setIsPopUp(true)} title="Join us" subTitle="Upgrade to admin account" />
      {isPopUp && (
        <PopConfirm desc="Your really want to be a admin?" onClose={() => setIsPopUp(false)} confirm={upgrade} />
      )}
    </>
  );
}

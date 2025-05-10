"use client";

import Button from "@/ui/buttons/Button";
import Input from "@/ui/inputs/Input";
import { useTempOverlay } from "@/context/Provider";
import useObject from "@/hooks/useObject";

import { ErrorType } from "@/types/response";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";

export default function DeleteAcc({ userId }: { userId: string }) {
  const { close, setChildren } = useTempOverlay();
  const Form = <Component close={close} userId={userId} />;
  return (
    <RiDeleteBin6Line onClick={() => setChildren(Form)} className="size-7 absolute top-4 right-4 cursor-pointer" />
  );
}

const Component = ({ close, userId }: { close: () => void; userId: string }) => {
  const {
    state: { isLoading, password },
    updateObject,
  } = useObject<{
    isLoading: boolean;
    password: string;
  }>();
  const { refresh, push } = useRouter();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateObject("isLoading", true);
    const response: ErrorType = await fetch("/api/user", {
      method: "DELETE",
      body: JSON.stringify({ userId, password }),
    }).then((res) => res.json());
    if (response.error) return updateObject("isLoading", false), toast.error(response.message);
    toast.success(response.message), push("sign-up");
    signOut();
    return refresh();
  };

  return (
    <form onSubmit={onSubmit} className="p-4 flex flex-col bg-neutralDark-700 gap-4 items-center">
      <div className="flex flex-col font-kanit px-5 text-center">
        <span className="text-2xl">Are you sure you want to delete your account?</span>
        <span className="text-orange-300">We will not be able to recover your information</span>
      </div>
      <Input
        isPassword
        disabled={isLoading}
        label="Put your password here"
        placeholder="password"
        value={password}
        onChange={(e) => updateObject("password", e.target.value)}
      />

      <span className="flex gap-3">
        <Button disabled={isLoading} type="button" onClick={close} className="bg-white text-black">
          Cancel
        </Button>
        <Button disabled={isLoading} type="submit">
          Delete
        </Button>
      </span>
    </form>
  );
};

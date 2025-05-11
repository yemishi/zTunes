"use client";

import { Button, Input } from "@/ui";
import { ErrorType } from "@/types/response";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { useState } from "react";
import { Modal } from "@/components";

export default function DeleteAcc({ userId }: { userId: string }) {
  const [isModal, setIsModal] = useState(false);
  const closeModal = () => setIsModal(false);
  return (
    <>
      <RiDeleteBin6Line onClick={() => setIsModal(true)} className="size-7 absolute top-4 right-4 cursor-pointer" />
      {isModal && (
        <Modal onClose={closeModal} className="modal-container">
          <Component onClose={closeModal} userId={userId} />
        </Modal>
      )}
    </>
  );
}

const Component = ({ onClose, userId }: { onClose: () => void; userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const { refresh, push } = useRouter();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const response: ErrorType = await fetch("/api/user", {
      method: "DELETE",
      body: JSON.stringify({ userId, password }),
    }).then((res) => res.json());
    if (response.error) return setIsLoading(false), toast.error(response.message);
    toast.success(response.message), push("/");
    signOut();
    return refresh();
  };

  return (
    <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4 items-center">
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
        onChange={(e) => setPassword(e.target.value)}
      />

      <span className="flex gap-3">
        <Button disabled={isLoading} type="button" onClick={onClose} className="bg-white text-black">
          Cancel
        </Button>
        <Button disabled={isLoading} type="submit">
          Delete
        </Button>
      </span>
    </form>
  );
};

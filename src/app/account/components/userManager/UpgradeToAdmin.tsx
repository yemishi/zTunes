"use client";
import { GrUserAdmin } from "react-icons/gr";
import { CardAcc } from "../CardAcc";
import { useTempOverlay } from "@/context/Provider";
import Button from "@/components/ui/buttons/Button";
import { ErrorType } from "@/types/response";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function UpgradeToAdmin({ userId }: { userId: string }) {
  const { setChildren, close } = useTempOverlay();
  const { refresh } = useRouter();
  const upgrade = async () => {
    const response: ErrorType = await fetch(`/api/user/upgrade?field=admin`, {
      method: "PATCH",
      body: JSON.stringify({ userId }),
    }).then((res) => res.json());
    if (response.error) return toast.error(response.message);
    toast.success(response.message);
    return refresh(), close();
  };

  const Popup = () => (
    <div className="flex flex-col bg-black-450 rounded-lg p-7 gap-6">
      <span className="text-xl font-medium">
        Your really want to be a admin ?
      </span>
      <span className="grid grid-cols-2 gap-3">
        <Button onClick={close} className="bg-white text-black">
          No
        </Button>
        <Button onClick={upgrade}>Yes</Button>
      </span>
    </div>
  );
  return (
    <CardAcc
      onClick={() => setChildren(Popup)}
      Icon={GrUserAdmin}
      title="Join us"
      subTitle="Upgrade to admin account"
    />
  );
}

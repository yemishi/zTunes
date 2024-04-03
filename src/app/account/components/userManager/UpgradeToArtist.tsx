"use client";

import InputFileImg from "@/components/ui/inputs/InputFileImg";
import Image from "@/components/ui/custom/Image";
import Button from "@/components/ui/buttons/Button";
import uploadImg from "@/firebase/handleImage";
import useObject from "@/hooks/useObject";

import { ErrorType } from "@/types/response";
import { useRouter } from "next/navigation";
import { GiMicrophone } from "react-icons/gi";
import { CardAcc } from "../CardAcc";
import { toast } from "react-toastify";
import { useMemo } from "react";

export default function UpgradeToArtist({ userId }: { userId: string }) {
const {
    state: { coverPhoto, isArtist, isLoading, summary },
    updateObject,
  } = useObject<{
    isArtist: boolean;
    coverPhoto: FileList | null;
    isLoading: boolean;
    summary: string;
  }>();
  const demoPhoto = useMemo(() => {
    if (coverPhoto) return URL.createObjectURL(coverPhoto[0]);
    return "";
  }, [coverPhoto]);

  const { refresh } = useRouter();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!coverPhoto || !summary) return toast.error("All fields is required");
    updateObject("isLoading", true);
    const urlImg = await uploadImg(coverPhoto);
    if (urlImg.error) return toast.error(urlImg.message);
    const body = {
      cover: urlImg.url,
      summary: summary,
      userId,
    };

    const response: ErrorType = await fetch("/api/user/upgrade?field=artist", {
      method: "PATCH",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    if (response.error)
      return toast.error(response.message), updateObject("isLoading", false);
    return refresh(), toast.success(response.message);
  };
  return (
    <>
      <CardAcc
        onClick={() => updateObject("isArtist", true)}
        Icon={GiMicrophone}
        title="I'm an artist"
        subTitle="Upgrade to artist account"
      />
      {isArtist && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center backdrop-brightness-50">
          <form
            onSubmit={onSubmit}
            className="flex flex-col items-center gap-4 bg-neutralDark-700 p-5 w-full max-w-[500px] md:rounded-md font-kanit"
          >
            <div className="relative w-full max-w-64 h-52">
              {demoPhoto && (
                <Image
                  src={demoPhoto}
                  className="h-full w-full object-cover -z-10 rounded-lg"
                />
              )}
              <InputFileImg
                isLoading={isLoading}
                className="absolute w-full h-full top-0 backdrop-brightness-75 "
                onChange={(e) => {
                  if (e.target.files && e.target.files[0])
                    updateObject("coverPhoto", e.target.files);
                }}
              />
            </div>

            <div>
              <span>Summary</span>
              <textarea
                className="bg-neutralDark-800 w-full min-h-24 max-h-64 p-2 rounded-lg mt-2"
                placeholder="Tell about you"
                onChange={(e) => updateObject("summary", e.target.value)}
              />
            </div>
            <span className="grid grid-cols-2 gap-3 mt-6">
              <Button
                type="button"
                onClick={() => updateObject("isArtist", false)}
                isLoading={isLoading}
                className="bg-white text-black"
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Upgrade
              </Button>
            </span>
          </form>
        </div>
      )}
    </>
  );
}

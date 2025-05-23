"use client";

import InputFileImg from "@/ui/inputs/InputFileImg";
import { Image, Button } from "@/ui";
import uploadImg from "@/firebase/handleImage";

import { ErrorType } from "@/types/response";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { toast } from "react-toastify";
import CardAcc from "../cardAcc/CardAcc";

export default function UpgradeToArtist({ userId }: { userId: string }) {
  const { refresh } = useRouter();

  const [isArtist, setIsArtist] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<FileList | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const demoPhoto = useMemo(() => {
    if (coverPhoto) return URL.createObjectURL(coverPhoto[0]);
    return "";
  }, [coverPhoto]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!coverPhoto || !summary) return toast.error("All fields is required");
    setIsLoading(true);
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
    if (response.error) return toast.error(response.message), setIsLoading(false);
    toast.success(response.message);
    refresh();
    return;
  };
  return (
    <>
      <CardAcc
        onClick={() => setIsArtist(true)}
        artistIcon
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
              {demoPhoto && <Image src={demoPhoto} className="h-full w-full object-cover -z-10 rounded-lg" />}
              <InputFileImg
                isLoading={isLoading}
                className="absolute w-full h-full top-0 backdrop-brightness-75 "
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) setCoverPhoto(e.target.files);
                }}
              />
            </div>

            <div>
              <span>Summary</span>
              <textarea
                className="bg-neutralDark-800 w-full min-h-24 max-h-64 p-2 rounded-lg mt-2"
                placeholder="Tell about you"
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <span className="grid grid-cols-2 gap-3 mt-6">
              <Button
                type="button"
                onClick={() => setIsArtist(false)}
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

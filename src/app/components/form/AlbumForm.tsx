import { isValidDate } from "@/app/utils/fnc";
import uploadImg, { deleteImage } from "@/firebase/handleImage";
import useObject from "@/hooks/useObject";
import { ErrorType } from "@/types/response";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "../ui/Image";
import InputFileImg from "../ui/inputs/InputFileImg";
import Input from "../ui/inputs/Input";
import DateFields from "../ui/inputs/DateFields";
import Button from "../ui/buttons/Button";
import { useRouter } from "next/navigation";

export default function AlbumForm({
  title,
  setTitle,
  onclose,
  artistId,
}: {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onclose: () => void;
  artistId: string;
}) {
  const {
    state: { coverPhoto, isLoading, type },
    updateObject,
  } = useObject<{
    isLoading: boolean;
    coverPhoto: FileList;
    type: "album" | "single";
  }>();

  const [releasedDate, setReleasedDate] = useState<{
    day: string;
    month: string;
    year: string;
  }>({ day: "", month: "", year: "" });

  const demoPhoto = coverPhoto && URL.createObjectURL(coverPhoto[0]);
  const activeType = (value: "single" | "album") =>
    type === value
      ? "border p-2 rounded-lg"
      : "text-white p-2 rounded-lg text-opacity-50 border border-white border-opacity-50";
  const { refresh } = useRouter();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!isValidDate(releasedDate.day, releasedDate.month, releasedDate.year))
      return toast.error("Choose a valid date");
    if (!coverPhoto) return toast.error("Cover photo is required");

    updateObject("isLoading", true);

    const { day, month, year } = releasedDate;
    const urlImg = await uploadImg(coverPhoto);
    if (urlImg.error)
      return toast.error(urlImg.message), updateObject("isLoading", false);

    const body = {
      title,
      releasedDate: `${day}/${month}/${year}`,
      artistId,
      coverPhoto: urlImg.url,
      type,
    };

    const response: ErrorType = await fetch(`/api/album`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    if (response.error) {
      await deleteImage(urlImg.url);
      updateObject("isLoading", false);
      return toast.error(response.message);
    }
    toast.success(response.message),
      refresh(),
      onclose(),
      updateObject("isLoading", false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-20 backdrop-brightness-50 flex justify-center items-center">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center gap-4 bg-neutralDark-700 p-5 w-full max-w-[500px] md:rounded-md font-kanit h-auto"
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
            className="absolute w-full h-full top-0 backdrop-brightness-75"
            onChange={(e) => {
              if (e.target.files && e.target.files[0])
                updateObject("coverPhoto", e.target.files);
            }}
          />
        </div>

        <div className="grid grid-cols-2 text-center gap-3">
          <span
            onClick={() => updateObject("type", "album")}
            className={activeType("album")}
          >
            Album
          </span>
          <span
            onClick={() => updateObject("type", "single")}
            className={activeType("single")}
          >
            Single
          </span>
        </div>

        <Input
          disabled={isLoading}
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div>
          <span>Released date</span>
          <DateFields
            isLoading={isLoading}
            values={releasedDate}
            setValues={setReleasedDate}
          />
        </div>

        <span className="grid grid-cols-2 gap-2 mt-7">
          <Button
            isLoading={isLoading}
            type="button"
            onClick={onclose}
            className="bg-white text-black"
          >
            Cancel
          </Button>
          <Button isLoading={isLoading}>Submit</Button>
        </span>
      </form>
    </div>
  );
}

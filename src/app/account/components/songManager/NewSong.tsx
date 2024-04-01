import Button from "@/components/ui/buttons/Button";
import AddCategories from "@/components/ui/inputs/AddCategories";
import Input from "@/components/ui/inputs/Input";
import InputFile from "@/components/ui/inputs/InputFile";
import uploadSong, { deleteSong } from "@/firebase/handleSong";

import { ErrorType } from "@/types/response";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type PropsType = {
  artistId: string;
  albumId: string;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  close: () => void;
};
export default function NewSong({
  artistId,
  close,
  name,
  albumId,
  setName,
}: PropsType) {
  const [categories, setCategories] = useState<string[]>([]);

  const [fileSong, setFileSong] = useState<FileList>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { refresh } = useRouter();

  const addSong = async () => {
    if (!fileSong) return toast.error("Audio file is required");

    setIsLoading(true);
    const urlSong = await uploadSong(fileSong);
    if (urlSong.error) return toast.error(urlSong.message);
    const body = {
      name,
      artistId,
      category: categories,
      albumId,
      urlSong: urlSong.url,
    };

    const response: ErrorType = await fetch("/api/song", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());

    if (response.error) {
      await deleteSong(urlSong.url);
      toast.error(response.message);
      return setIsLoading(false);
    }
    setIsLoading(false);
    toast.success(response.message);
    refresh(), close();
  };

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === fileSong || !e.target.files || !e.target.files[0])
      return;

    if (!e.target.files[0].type.startsWith("audio/"))
      return toast.error("Insert a correctly audio file");
    setFileSong(e.target.files);
  };
  return (
    <div className="fixed top-0 left-0 h-full w-full flex justify-center items-center backdrop-brightness-50">
      <form
        onSubmit={(e) => {
          e.preventDefault(), addSong();
        }}
        className=" flex flex-col items-center gap-4 bg-neutralDark-700 p-5 w-full max-w-[500px] md:rounded-md font-kanit "
      >
        <Input
          disabled={isLoading}
          label="Song name"
          placeholder="Song"
          value={name}
          onChange={(e) => setName(e.target.value)}
          classNameInput="bg-transparent backdrop-brightness-150 border-neutralDark-400"
        />

        <AddCategories
          label="Song Categories"
          className="flex-col items-center"
          categories={categories}
          setCategories={setCategories}
        />

        <InputFile
          className={isLoading ? "pointer-events-none animate-pulse" : ""}
          iconType="song"
          onChange={onChangeFile}
        />
        {fileSong && fileSong[0] && (
          <span className="text-orange-300 text-center">
            {fileSong[0].name}
          </span>
        )}
        <span className="grid grid-cols-2 gap-3 ">
          <Button
            type="button"
            disabled={isLoading}
            onClick={close}
            className="rounded-lg bg-white text-black"
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            className="rounded-lg bg-green-600"
          >
            Confirm
          </Button>
        </span>
      </form>
    </div>
  );
}

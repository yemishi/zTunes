import uploadImg, { deleteImage } from "@/firebase/handleImage";
import { InputFileImg, Input, DateFields, Button } from "@/ui";

import { isValidDate } from "@/utils/helpers";
import { ErrorType } from "@/types/response";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useForm from "@/hooks/useForm/useForm";

interface Props {
  title: string;
  onClose: () => void;
  artistId: string;
}
export default function AlbumForm({ artistId, onClose, title: dataTitle }: Props) {
  const fields = {
    title: { value: dataTitle, min: 1 },
    desc: { value: "", min: 1 },
    type: { value: "", min: 1 },
    day: { value: "", min: 1 },
    month: { value: "", min: 1 },
    year: { value: "", min: 1 },
    coverPhoto: { value: "", min: 1 },
  };

  type FieldValues = { [K in keyof typeof fields]: (typeof fields)[K]["value"] };
  interface FieldValuesFormatted extends Omit<FieldValues, "coverPhoto"> {
    coverPhoto: string | FileList;
  }
  const {
    values: { day, desc, month, title, type, year, coverPhoto },
    errors,
    onChange,
    setValue,
    validateAll,
  } = useForm<FieldValuesFormatted>(fields);

  const [isLoading, setIsLoading] = useState(false);
  const [demoPhoto, setDemoPhoto] = useState<string>();

  const { refresh } = useRouter();
  const types = ["single", "album"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return toast.error("Invalid image type");

    const reader = new FileReader();
    reader.onloadend = () => {
      setDemoPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
    setValue("coverPhoto", e.target.files as any);
  };
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidDate(day, month, year) || !coverPhoto || !validateAll()) return;

    setIsLoading(true);

    const urlImg = await uploadImg(coverPhoto as FileList);
    if (urlImg.error) return toast.error(urlImg.message), setIsLoading(false);

    const body = {
      title,
      releasedDate: `${day}/${month}/${year}`,
      artistId,
      coverPhoto: urlImg.url,
      type,
      desc,
    };

    const response: ErrorType = await fetch(`/api/album`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    if (response.error) {
      await deleteImage(urlImg.url!);
      setIsLoading(true);
      return;
    }
    toast.success(response.message || "Your album was successfully created."), refresh(), onClose(), setIsLoading(true);
  };

  return (
    <form onSubmit={onSubmit} className="gap-6 md:text-lg p-5 w-full h-full md:rounded-md text-black flex flex-col">
      <div className="flex flex-col w-full gap-2 md:gap-4">
        <div className="relative w-full h-52 md:h-64">
          <InputFileImg
            className="bg-black/70 mx-auto w-80 mb-6"
            isLoading={isLoading}
            error={!!errors.coverPhoto}
            demoPhoto={demoPhoto}
            onChange={handleFileChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="textarea">Description</label>
          <textarea
            onChange={onChange}
            name="desc"
            className="rounded-lg p-4 bg-black/30 text-white w-full "
            placeholder="Description of album"
            id="textarea"
            rows={5}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="p-3 flex justify-center items-center gap-5">
          {types.map((e, i) => {
            return (
              <button
                type="button"
                key={`${e}_${i}`}
                onClick={() => setValue("type", e)}
                className={`${type === e ? "bg-amber-400 border-black" : "bg-white brightness-95"} ${
                  errors.type ? "border border-red-300" : ""
                } border-2 font-semibold first-letter:uppercase p-2 rounded-lg cursor-pointer `}
              >
                {e}
              </button>
            );
          })}
        </div>
      </div>

      <Input
        className="!border-black self-center"
        disabled={isLoading}
        label="Title"
        placeholder="Album title"
        required
        value={title}
        name="title"
        onChange={onChange}
      />

      <div className="self-center max-w-120 flex flex-col gap-2">
        <span className="">Released date</span>
        <DateFields
          optionsClassName="text-white"
          className="!border-black"
          isLoading={isLoading}
          values={{ day, month, year }}
          setValue={setValue}
          errors={errors}
        />
      </div>

      <span className="grid grid-cols-2 gap-3 md:px-20 mt-auto ">
        <Button isLoading={isLoading} type="button" onClick={onClose} className="bg-white text-black">
          Cancel
        </Button>
        <Button isLoading={isLoading}>Submit</Button>
      </span>
    </form>
  );
}

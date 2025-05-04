import uploadImg, { deleteImage } from "@/firebase/handleImage";
import Image from "../ui/custom/Image";
import InputFileImg from "../ui/inputs/InputFileImg";
import Input from "../ui/inputs/Input";
import DateFields from "../ui/inputs/DateFields";
import Button from "../ui/buttons/Button";

import { isValidDate } from "@/utils/helpers";
import { ErrorType } from "@/types/response";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useForm from "@/hooks/useForm";

interface Props {
  title: string;
  onclose: () => void;
  artistId: string;
}
export default function AlbumForm({ artistId, onclose, title: dataTitle }: Props) {
  const fields = {
    title: { value: dataTitle, min: 1 },
    desc: { value: "", min: 1 },
    type: { value: "", min: 1 },
    day: { value: "", min: 1 },
    month: { value: "", min: 1 },
    year: { value: "", min: 1 },
  };
  type FieldValues = { [K in keyof typeof fields]: (typeof fields)[K]["value"] };

  const {
    onChange,
    setValue,
    errors,
    values: { desc, title, type, day, month, year },
  } = useForm<FieldValues>(fields);

  const [coverPhoto, setCoverPhoto] = useState<FileList>();
  const [isLoading, setIsLoading] = useState(false);

  const demoPhoto = useMemo(() => (coverPhoto ? URL.createObjectURL(coverPhoto[0]) : ""), [coverPhoto]);

  const activeType = (value: "single" | "album") =>
    type === value
      ? "border p-2 rounded-lg pointer-events-none"
      : "text-white p-2 rounded-lg text-opacity-50 border border-white border-opacity-50 cursor-pointer";
  const { refresh } = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidDate(day, month, year) || !coverPhoto) return;

    setIsLoading(true);

    const urlImg = await uploadImg(coverPhoto);
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
    toast.success(response.message || "Your album was successfully created."), refresh(), onclose(), setIsLoading(true);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-20 backdrop-brightness-50 flex justify-center items-center">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center gap-4 bg-neutralDark-700 p-5 w-full max-w-[650px] md:text-lg max-h-full md:rounded-md overflow-auto font-kanit h-auto"
      >
        <div className="flex flex-col w-full gap-2 md:gap-4 md:grid md:grid-cols-2">
          <div className="relative w-full h-52 md:h-64">
            {demoPhoto && <Image src={demoPhoto} className="h-full w-full object-cover -z-10 rounded-lg" />}
            <InputFileImg
              isLoading={isLoading}
              className="absolute w-full h-full top-0 backdrop-brightness-75"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) setCoverPhoto(e.target.files);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-200 " htmlFor="textarea">
              Description
            </label>
            <textarea
              onChange={onChange}
              name="desc"
              className="inputForm bg-transparent h-full backdrop-brightness-150 border border-neutralDark-400"
              placeholder="Description of album"
              id="textarea"
              rows={5}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 text-center gap-3">
          <span onClick={() => setValue("type", "album")} className={activeType("album")}>
            Album
          </span>
          <span onClick={() => setValue("type", "single")} className={activeType("single")}>
            Single
          </span>
        </div>

        <Input
          classNameInput="bg-transparent backdrop-brightness-150 border-neutralDark-400 "
          disabled={isLoading}
          label="Title"
          placeholder="Album title"
          required
          value={title}
          name="title"
          onChange={onChange}
        />

        <div>
          <span>Released date</span>
          <DateFields
            className="bg-transparent backdrop-brightness-150 border-neutralDark-400 "
            isLoading={isLoading}
            values={{ bDay: day, bMonth: month, bYear: year }}
            setValue={setValue}
            errors={errors}
          />
        </div>

        <span className="grid grid-cols-2 gap-2 mt-7">
          <Button isLoading={isLoading} type="button" onClick={onclose} className="bg-white text-black">
            Cancel
          </Button>
          <Button isLoading={isLoading}>Submit</Button>
        </span>
      </form>
    </div>
  );
}

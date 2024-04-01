"use client";

import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ErrorType, UserType } from "@/types/response";

import Button from "../ui/buttons/Button";
import uploadImage from "@/firebase/handleImage";
import Input from "../ui/inputs/Input";
import InputFileImg from "../ui/inputs/InputFileImg";
import AddCategories from "../ui/inputs/AddCategories";

export default function NewPlaylistForm({
  username,
  onSuccess,
  onclose,
}: {
  username: string;
  onSuccess?: () => void;
  onclose: () => void;
}) {
  type InputsType = z.infer<typeof FormSchema>;

  const [demoPhoto, setDemoPhoto] = useState<string>();
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCategories, setIsCategories] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      const data: UserType | ErrorType = await fetch(
        `/api/user?username=${username}`
      ).then((res) => res.json());
      if (data.error) return toast.error(data.message);
      setIsAdmin(data.isAdmin);
    };
    fetchData();
  }, []);

  const FormSchema = z.object({
    coverPhoto: z.any(),
    name: z
      .string()
      .min(1, "This field is required")
      .max(20, "The maximum characters is 15"),
    desc: z.string(),
  });

  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
  } = useForm<InputsType>({ resolver: zodResolver(FormSchema) });

  const { refresh } = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/"))
      return toast.error("Invalid image type");
    const reader = new FileReader();
    reader.onloadend = () => {
      setDemoPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
    setValue("coverPhoto", e.target.files as any);
    clearErrors("coverPhoto");
  };

  const onsubmit: SubmitHandler<InputsType> = async (values) => {
    FormSchema.parse(values);

    if (!values.coverPhoto)
      return setError("coverPhoto", { message: "This field is required" });
    setIsLoading(true);
    const { desc, name, coverPhoto } = values;
    const imageUrl = await uploadImage(coverPhoto);
    if (imageUrl.error)
      return toast.error(imageUrl.message), setIsLoading(false);

    const body = {
      title: name,
      username,
      isPublic,
      desc,
      coverPhoto: imageUrl.url,
      songs: [],
      officialCategories:
        isAdmin && isCategories && categories.length > 0 ? categories : null,
    };

    const uploadPlaylist: ErrorType = await fetch("/api/playlist", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    const { error, message } = uploadPlaylist;
    if (error) return toast.error(message), setIsLoading(false);
    return (
      toast(message),
      refresh(),
      onclose(),
      setIsLoading(false),
      onSuccess ? onSuccess() : null
    );
  };
  return (
    <form
      onSubmit={handleSubmit(onsubmit)}
      className="grid sm:grid-cols-2  font-kanit gap-6 bg-neutralDark-700 p-5 w-full max-w-[768px] md:rounded-md max-h-full overflow-auto"
    >
      <InputFileImg
        error={!!errors.coverPhoto}
        demoPhoto={demoPhoto}
        onChange={handleFileChange}
      />

      <Input
        type="text"
        error={errors.name?.message}
        label="Name"
        {...register("name")}
        placeholder="Playlist name"
        classNameInput="bg-transparent backdrop-brightness-150 border-neutralDark-400"
      />

      <div className="flex flex-col gap-1 ">
        <label className="text-gray-200" htmlFor="textarea">
          Description
        </label>
        <textarea
          className="inputForm bg-transparent backdrop-brightness-150 border border-neutralDark-400"
          placeholder="Description of playlist"
          {...register("desc")}
          id="textarea"
          rows={5}
        ></textarea>
      </div>

      <Toggle
        isTrue="Everyone can see this playlist"
        isFalse="Only you can see this playlist"
        title="Public"
        state={isPublic}
        setState={setIsPublic}
      />

      {isAdmin && (
        <div className="flex flex-col gap-7 sm:col-span-2 sm:ml-auto sm:mr-auto items-center">
          <Toggle
            title="Official"
            isFalse="This playlist will not be official"
            isTrue="This playlist will be official"
            state={isCategories}
            setState={setIsCategories}
          />
          {isCategories && (
            <AddCategories
              categories={categories}
              setCategories={setCategories}
            />
          )}
        </div>
      )}

      <span className="grid grid-cols-2 gap-3 md:px-20 md:mt-11 sm:col-span-2">
        <Button
          isLoading={isLoading}
          type="button"
          onClick={onclose}
          className="bg-white text-black"
        >
          Back
        </Button>
        <Button isLoading={isLoading} type="submit">
          Submit
        </Button>
      </span>
    </form>
  );
}

function Toggle({
  state,
  setState,
  isFalse,
  isTrue,
  title,
}: {
  isTrue: string;
  isFalse: string;
  title: string;
  state: boolean;
  setState: React.Dispatch<boolean>;
}) {
  return (
    <div
      onClick={() => setState(!state)}
      className="flex items-center justify-between sm:items-end sm:self-end w-full gap-5"
    >
      <div className="flex flex-col">
        <span className="text-lg">{title}</span>
        <span className="text-gray-400 font-light">
          {state ? isTrue : isFalse}
        </span>
      </div>

      <span
        className={`w-14 h-7 rounded-full self-center relative after:absolute after:h-5/6 after:w-6 after:top-2/4 after:-translate-y-2/4 after:bg-white 
    after:rounded-full duration-200 after:duration-200 cursor-pointer ${
      state
        ? "bg-orange-600 bg-opacity-80 after:left-2/4"
        : "bg-neutralDark-400 after:left-1"
    }`}
      />
    </div>
  );
}

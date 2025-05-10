"use client";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { ErrorType } from "@/types/response";

import Button from "@/ui/buttons/Button";
import uploadImage from "@/firebase/handleImage";
import Input from "../../ui/inputs/Input";
import InputFileImg from "../../ui/inputs/InputFileImg";
import AddCategories from "../../ui/inputs/AddCategories";
import useForm from "@/hooks/useForm";

export default function PlaylistForm({
  username,
  onSuccess,
  onClose,
}: {
  username: string;
  onSuccess?: () => void;
  onClose: () => void;
}) {
  const [demoPhoto, setDemoPhoto] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCategories, setIsCategories] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`/api/user?username=${username}`).then((res) => res.json());
      if (data.error) return toast.error(data.message);
      setIsAdmin(data.isAdmin);
    };
    fetchData();
  }, []);

  const {
    errors,
    onChange,
    setError,
    setValue,
    validateAll,
    values: { coverPhoto, desc, name },
  } = useForm<{ name: string; desc: string; coverPhoto: string | FileList }>({
    name: { value: "", min: 1, max: 20 },
    desc: { value: "" },
    coverPhoto: { value: "" },
  });

  const { refresh } = useRouter();

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

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!coverPhoto) return setError("coverPhoto", "This field is required");

    if (!validateAll()) return;
    setIsLoading(true);

    const imageUrl = await uploadImage(coverPhoto as FileList);
    if (imageUrl.error) return toast.error(imageUrl.message), setIsLoading(false);

    const body = {
      title: name,
      username,
      isPublic,
      desc,
      coverPhoto: imageUrl.url,
      songs: [],
      officialCategories: isAdmin && isCategories && categories.length > 0 ? categories : null,
    };

    const uploadPlaylist: ErrorType = await fetch("/api/playlist", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    const { error, message } = uploadPlaylist;
    if (error) return toast.error(message), setIsLoading(false);
    return toast(message), refresh(), onClose(), setIsLoading(false), onSuccess ? onSuccess() : null;
  };
  return (
    <form onSubmit={onSubmit} className="gap-6 md:text-lg p-5 w-full h-full md:rounded-md text-black flex flex-col">
      <InputFileImg
        className="bg-black/70 mx-auto w-80 mb-6"
        isLoading={isLoading}
        error={!!errors.coverPhoto}
        demoPhoto={demoPhoto}
        onChange={handleFileChange}
      />

      <Input
        type="text"
        borderColor="black"
        className="self-center"
        disabled={isLoading}
        error={errors.name || ""}
        name="name"
        value={name}
        onChange={onChange}
        label="Playlist name"
        placeholder="Playlist name"
      />

      <div className="flex flex-col gap-1 ">
        <label htmlFor="textarea">Description</label>
        <textarea
          className="rounded-lg p-4 bg-black/30 text-white w-full "
          placeholder="Description of playlist"
          name="desc"
          onChange={onChange}
          value={desc}
          id="textarea"
          rows={5}
        ></textarea>
      </div>

      <Toggle
        desc={isPublic ? "Everyone can see this playlist" : "Only you can see this playlist"}
        isActive={isPublic}
        toggle={() => setIsPublic((prev) => !prev)}
        title={isPublic ? "Public" : "Private"}
      />

      {isAdmin && (
        <div className="flex flex-col gap-7 sm:col-span-2 sm:ml-auto sm:mr-auto items-center">
          <Toggle
            title="Official"
            desc={isCategories ? "This playlist will be official" : "This playlist will not be official"}
            isActive={isCategories}
            toggle={() => setIsCategories((prev) => !prev)}
          />
          {isCategories && <AddCategories categories={categories} setCategories={setCategories} />}
        </div>
      )}

      <span className="grid grid-cols-2 gap-3 md:px-20 mt-auto ">
        <Button disabled={isLoading} type="button" onClick={onClose} className="bg-white text-black">
          Back
        </Button>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </span>
    </form>
  );
}

function Toggle({
  isActive,
  title,
  desc,
  toggle,
}: {
  isActive: boolean;
  desc: string;
  title: string;
  toggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between sm:items-end sm:self-end w-full gap-5">
      <div className="flex flex-col">
        <span className="text-lg">{title}</span>
        <span className="font-semibold">{desc}</span>
      </div>

      <span
        onClick={toggle}
        className={`w-14 h-7 rounded-full self-center relative after:absolute after:h-5/6 after:w-6 after:top-2/4 after:-translate-y-2/4 after:bg-white 
    after:rounded-full duration-200 after:duration-200 cursor-pointer ${
      isActive ? "bg-orange-400 after:left-2/4" : "bg-black/50 after:left-1"
    }`}
      />
    </div>
  );
}

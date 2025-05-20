"use client";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

import Button from "@/ui/buttons/Button";
import uploadImage, { deleteImage } from "@/firebase/handleImage";
import Input from "../../ui/inputs/Input";
import InputFileImg from "../../ui/inputs/InputFileImg";
import AddCategories from "../../ui/inputs/AddCategories";
import useForm from "@/hooks/useForm/useForm";
import ToggleCheck from "./toggleCheck/ToggleCheck";
import { createPlaylist, updatePlaylist } from "./playlistFormActions";

export default function PlaylistForm({
  username,
  onSuccess,
  onClose,
  id,
  formInfo,
}: {
  username: string;
  onClose: () => void;
  id?: string;
  onSuccess?: () => void;
  formInfo?: {
    coverPhoto: string;
    name: string;
    desc?: string;
    categories?: string[];
    isPublic?: boolean;
  };
}) {
  const [demoPhoto, setDemoPhoto] = useState(formInfo?.coverPhoto || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(!!formInfo?.isPublic);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCategories, setIsCategories] = useState(!!formInfo?.categories);
  const [categories, setCategories] = useState(formInfo?.categories || []);

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
    name: { value: formInfo?.name || "", min: 1, max: 20 },
    desc: { value: formInfo?.desc || "" },
    coverPhoto: { value: formInfo?.coverPhoto || "" },
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

    const fetchImg = async () => {
      if (formInfo?.coverPhoto && formInfo.coverPhoto !== coverPhoto) await deleteImage(formInfo?.coverPhoto);
      if (coverPhoto === demoPhoto) return { url: coverPhoto, error: false, message: "" };
      const imageUrl = await uploadImage(coverPhoto as FileList);
      return imageUrl;
    };
    const imgData = await fetchImg();
    if (imgData.error) return toast.error(imgData.message), setIsLoading(false);

    const body = {
      title: name,
      username,
      isPublic,
      desc,
      coverPhoto: imgData.url as string,
      officialCategories: isAdmin && isCategories && categories.length > 0 ? categories : null,
    };
    const fetchPlaylist = async () => (id ? await updatePlaylist(body, id) : await createPlaylist(body));
    const data = await fetchPlaylist();
    const { error, message } = data;
    if (error) return toast.error(message), setIsLoading(false);
    return toast(message), refresh(), onClose(), setIsLoading(false), onSuccess ? onSuccess() : null;
  };
  return (
    <form onSubmit={onSubmit} className="gap-6 md:text-lg p-5 w-full md:rounded-md text-black flex flex-col">
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

      <ToggleCheck
        desc={isPublic ? "Everyone can see this playlist" : "Only you can see this playlist"}
        isActive={isPublic}
        toggle={() => setIsPublic((prev) => !prev)}
        title={isPublic ? "Public" : "Private"}
      />

      {isAdmin && (
        <div className="flex flex-col w-full  gap-7 sm:col-span-2 sm:ml-auto sm:mr-auto items-center">
          <ToggleCheck
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
          {id ? "Update" : "Create"}
        </Button>
      </span>
    </form>
  );
}

import { useState } from "react";
import Image from "./Image";
import InputFileImg from "../inputs/InputFileImg";
import { toast } from "react-toastify";
import handleImage, { deleteImage } from "@/firebase/handleImage";
import { ErrorType } from "@/types/response";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface InputProps extends React.HTMLAttributes<HTMLElement> {
  isOwner: boolean;
  initialValue: string;
  uploadUrl: string;
  fieldUpload: string;
  updateSession?: boolean;
  extraBody?: object;
  method?: string;
}

export default function EditableImage({
  initialValue,
  isOwner,
  uploadUrl,
  extraBody,
  fieldUpload,
  method,
  updateSession,
  ...props
}: InputProps) {
  const { className, ...rest } = props;

  const [coverPhoto, setCoverPhoto] = useState<string>(initialValue);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { update: updateImg } = useSession();
  const { refresh } = useRouter();

  const defaultSize =
    className?.includes("h-") ||
    className?.includes("size") ||
    className?.includes("w-")
      ? ""
      : "size-44";
  const defaultRadius = className?.includes("rounded") ? "" : "rounded-full";

  const onchange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const upload = await handleImage(e.target.files as FileList);

    if (upload.error) return toast.error(upload.message), setIsLoading(false);
    const oldUrl = coverPhoto;
    setCoverPhoto(upload.url);
    if (updateSession) {
      await updateImg({ picture: upload.url });
    }

    const body = { [fieldUpload]: upload.url, ...extraBody };
    const update: ErrorType = await fetch(uploadUrl, {
      method: `${method || "PATCH"}`,
      body: JSON.stringify(body),
    }).then((res) => res.json());
    if (update.error) toast.error(update.message);
    await deleteImage(oldUrl);

    refresh(), setIsLoading(false);
  };

  return (
    <div
      className={`relative overflow-hidden shadow-lg ${defaultSize} ${defaultRadius} ${
        className ? className : ""
      }`}
      {...rest}
    >
      <Image
        onMouseEnter={() => setIsEdit(true)}
        src={coverPhoto}
        className={`${
          className ? className : ""
        } h-full w-full object-cover object-center shadow-md ${defaultRadius}`}
      />
      {((isEdit && isOwner) || isLoading) && (
        <InputFileImg
          isLoading={isLoading}
          onChange={onchange}
          onMouseLeave={() => setIsEdit(false)}
          error={false}
          className={`absolute top-0 left-0 w-full shadow-md bg-transparent backdrop-brightness-50 h-full  ${defaultRadius}`}
        />
      )}
    </div>
  );
}

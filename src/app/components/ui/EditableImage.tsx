import { useState } from "react";
import InputFile from "./inputs/InputFile";
import Image from "./Image";
import InputFileImg from "./inputs/imageUploader";
import { toast } from "react-toastify";
import handleImage, { deleteImage } from "@/firebase/handleImage";
import { ErrorType } from "@/types/response";
import { useRouter } from "next/navigation";

interface InputProps extends React.HTMLAttributes<HTMLElement> {
  isOwner: boolean;
  initialValue: string;
  uploadUrl: string;
  extraBody?: object;
  fieldUpload: string;
  method?: string;
}

export default function EditableImage({
  initialValue,
  isOwner,
  uploadUrl,
  extraBody,
  fieldUpload,
  method,
  ...props
}: InputProps) {
  const { className, ...rest } = props;

  const [coverPhoto, setCoverPhoto] = useState<string>(initialValue);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { refresh } = useRouter();

  const defaultSize =
    className?.includes("h-") ||
    className?.includes("size") ||
    className?.includes("w-")
      ? ""
      : "size-36";
  const defaultRadius = className?.includes("rounded") ? "" : "rounded-full";

  const onchange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0].type.startsWith("image/"))
      return toast.error("Invalid image type");

    setIsLoading(true);
    const upload = await handleImage(e.target.files);

    if (upload.error) return toast.error(upload.message), setIsLoading(false);

    const oldUrl = coverPhoto;
    setCoverPhoto(upload.url);

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
      className={`relative shadow-lg ${defaultSize} ${defaultRadius} `}
      {...rest}
    >
      <Image
        onMouseEnter={() => setIsEdit(true)}
        src={coverPhoto}
        className="h-full w-full"
      />

      {((isEdit && isOwner) || isLoading) && (
        <InputFileImg
          isLoading={isLoading}
          onChange={onchange}
          onMouseLeave={() => setIsEdit(false)}
          error={false}
          className="absolute top-0 left-0 w-full bg-transparent backdrop-brightness-75 h-full"
        />
      )}
    </div>
  );
}

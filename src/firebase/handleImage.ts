import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { analytics } from "./firebase-config";
import { ErrorType } from "@/types/response";

export default async function (
  file: FileList
): Promise<{ error: false; url: string } | ErrorType> {
  try {
    if (!file[0].type.startsWith("image/"))
      return {
        error: true,
        message: "Insert a valid image",
      };

    const fileRef = ref(
      analytics,
      `images/${file[0].name}?uploadAt=${new Date().getTime()}`
    );
    const upload = (await uploadBytes(fileRef, file[0]).then((res) =>
      getDownloadURL(res.ref).then((url) => url)
    )) as string;
    return { error: false, url: upload };
  } catch (error) {
    return {
      error: true,
      message: "Something went wrong",
    };
  }
}

export async function deleteImage(
  url: string
): Promise<{ error: false; message: string } | ErrorType> {
  try {
    const fileRef = ref(analytics, url);
    await deleteObject(fileRef);
    return {
      error: false,
      message: "Image deleted with success",
    };
  } catch (error) {
    return {
      error: true,
      message: "we had a problem trying to delete the image",
    };
  }
}

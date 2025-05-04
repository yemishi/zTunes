import { analytics } from "./firebase-config";
import { ErrorType } from "@/types/response";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default async function uploadSong(file: FileList) {
  try {
    if (!file[0].type.startsWith("audio/"))
      return {
        error: true,
        message: "Insert a valid audio",
      };

    const fileRef = ref(analytics, `songs/${file[0].name}?uploadAt=${new Date().getTime()}`);
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

export async function deleteSong(url: string): Promise<ErrorType | { error?: false; message: string }> {
  try {
    const fileRef = ref(analytics, url);
    await deleteObject(fileRef);
    return {
      message: "Song deleted with success",
    };
  } catch (error) {
    return {
      message: "Something went wrong",
      error: true,
    };
  }
}

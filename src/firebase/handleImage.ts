import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { analytics } from "./firebase-config";

export default async function uploadImg(file: FileList) {
  try {
    if (!file[0].type.startsWith("image/"))
      return {
        error: true,
        message: "Insert a valid image",
      };

    const fileRef = ref(analytics, `images/${file[0].name}?uploadAt=${new Date().getTime()}`);
    const upload = (await uploadBytes(fileRef, file[0]).then((res) =>
      getDownloadURL(res.ref).then((url) => url)
    )) as string;
    return { error: false, url: upload };
  } catch (error) {
    return {
      error: true,
      message: "We had a problem trying to upload the image",
    };
  }
}

export async function deleteImage(url: string) {
  try {
    const fileRef = ref(analytics, url);
    await deleteObject(fileRef);
    return {
      message: "Image deleted with success",
    };
  } catch (error) {
    return {
      error: true,
      message: "we had a problem trying to delete the image",
    };
  }
}

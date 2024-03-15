import { ErrorType } from "@/types/response";
import { usePathname } from "next/navigation";
import Vibrant from "node-vibrant";

export const navbarHidden = () =>
  urlMatch("sign-in") ||
  urlMatch("sign-up") ||
  urlMatch("validation") ||
  urlMatch("password-reset");

export const urlMatch = (path: string) => {
  const pathName = usePathname();
  return pathName.includes(path);
};

export const getVibrantColor = async (img: string, lowOpacity?: true) => {
  try {
    const palette = await Vibrant.from(img).getPalette();
    const isLowOpacity = lowOpacity ? 0.6 : 1;
    return {
      default: `rgb(${palette.DarkMuted?.rgb.join(",")},${isLowOpacity})`,
      light: `rgb(${palette.LightVibrant?.rgb.join(",")},${isLowOpacity})`,
      dark: `rgb(${palette.DarkVibrant?.rgb.join(",")},${
        lowOpacity ? 0.6 : ""
      })`,
      mutedDark: `rgb(${palette.DarkMuted?.rgb.join(",")},${isLowOpacity})`,
      mutedLight: `rgb(${palette.LightMuted?.rgb.join(",")},${isLowOpacity})`,
      muted: `rgb(${palette.Muted?.rgb.join(",")},${isLowOpacity})`,
    };
  } catch (error) {
    return null;
  }
};

export const removeFromPlaylist = async (
  selected: {
    songId: any;
    createdAt: Date | undefined;
  },
  playlistId: string
) => {
  const body = {
    selected,
    toRemove: true,
    id: playlistId,
  };
  const data: Promise<ErrorType> = fetch(`/api/playlist`, {
    method: "PATCH",
    body: JSON.stringify(body),
  }).then((res) => res.json());
  return data;
};

export const isAvailable = async (
  value: string,
  field?: string
): Promise<
  | ErrorType
  | {
      error: false;
      response: boolean;
    }
> => {
  try {
    const checkIsAvailable: boolean = await fetch(
      `/api/user/validation?isAvailable=true&value=${value}&field=${
        field || "username"
      }`
    ).then((res) => res.json());
    return {
      error: false,
      response: checkIsAvailable,
    };
  } catch (error) {
    return {
      error: true,
      message: "We had a problem trying to check the available",
    };
  }
};

export const updateUser = async (body: {
  userId: string;
  avatar?: string;
  username?: string;
}): Promise<ErrorType> => {
  try {
    const update: ErrorType = await fetch(`/api/user`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    return update;
  } catch (error) {
    return {
      error: true,
      message: "We had a problem trying to update the user",
    };
  }
};

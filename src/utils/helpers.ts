"use client";
import { ErrorType } from "@/types/response";
import { format, lastDayOfMonth } from "date-fns";
import { usePathname } from "next/navigation";

const urlMatch = (path: string) => {
  const pathName = usePathname();
  return pathName.includes(path);
};

const removeFromPlaylist = async (
  songSelected: {
    songId: any;
    createdAt: Date | undefined;
  },
  playlistId: string
) => {
  const body = {
    songSelected,
    toRemove: true,
    id: playlistId,
  };
  const data: Promise<ErrorType> = fetch(`/api/playlist`, {
    method: "PATCH",
    body: JSON.stringify(body),
  }).then((res) => res.json());
  return data;
};

const isAvailable = async (
  value: string,
  field?: string
): Promise<
  | { error: true; message: string }
  | {
      error: false;
      response: boolean;
    }
> => {
  try {
    const checkIsAvailable: boolean = await fetch(
      `/api/user/validation?isAvailable=true&value=${value}&field=${field || "username"}`
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

const updateUser = async (body: { userId: string; avatar?: string; username?: string }): Promise<ErrorType> => {
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

const isValidDate = (day: string, month: string, year: string) => {
  if (Number(year) < 1800 || !day || !month || !year) return false;
  const limitDay = format(lastDayOfMonth(new Date(Number(year), Number(month))), "d");
  return limitDay >= day;
};

const getSongDuration = async (urlSong: string) => {
  if (typeof window !== "undefined") {
    return new Promise((resolve) => {
      const audio = new Audio(urlSong);
      audio.addEventListener("loadedmetadata", () => {
        resolve(Math.floor(audio.duration));
      });

      audio.load();
    });
  }
  return 0;
};

const cleanClasses = (className = "", fallback = "") => {
  const current = className.split(/\s+/);
  const fallbackClasses = fallback.split(/\s+/);

  const getPrefix = (cls: string) => cls.split("-")[0];

  const existingPrefixes = new Set(current.map(getPrefix));

  const filteredFallback = fallbackClasses.filter((cls) => {
    const prefix = getPrefix(cls);
    return !existingPrefixes.has(prefix);
  });

  return [...current, ...filteredFallback].join(" ").trim();
};

const isLightBg = (hexColor: string): boolean => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
};

export { cleanClasses, isValidDate, getSongDuration, updateUser, isAvailable, removeFromPlaylist, urlMatch, isLightBg };

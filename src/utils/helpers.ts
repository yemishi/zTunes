import { ErrorType } from "@/types/response";
import { format, lastDayOfMonth } from "date-fns";

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
  const splitClasses = (str: string) => str.trim().split(/\s+/).filter(Boolean);

  const getPrefixes = (cls: string) => cls.split(":").pop()!.split("-")[0];

  const currentClasses = splitClasses(className);
  const fallbackClasses = splitClasses(fallback);

  const existingPrefixes = new Set(currentClasses.map(getPrefixes));

  const filteredFallback = fallbackClasses.filter((cls) => {
    const prefix = getPrefixes(cls);
    return !existingPrefixes.has(prefix);
  });

  const merged = [...new Set([...currentClasses, ...filteredFallback])];

  return merged.join(" ");
};

function getFormattedDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}

export {
  cleanClasses,
  isValidDate,
  getSongDuration,
  updateUser,
  isAvailable,
  removeFromPlaylist,
  getFormattedDuration,
};

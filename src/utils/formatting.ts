export const formatDuration = (
  duration: number,
  onlyNumber?: boolean
): string => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  const formattedDuration =
    (hours > 0 ? hours + "h " : "") +
    (minutes > 0 ? minutes + "min " : "") +
    (seconds > 0 ? seconds + "s" : "");

  if (onlyNumber)
    return `${hours ? `${hours}:` : ""}${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;

  return formattedDuration.trim();
};

export const dateFormat = (data: Date): string => {
  const date = new Date(data);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

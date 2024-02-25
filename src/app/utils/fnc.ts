import { usePathname } from "next/navigation";
import Vibrant from "node-vibrant";

export const navbarHidden = () => {
  return (
    urlMatch("sign-in") ||
    urlMatch("sign-up") ||
    urlMatch("validation") ||
    urlMatch("password-reset")
  );
};

export const urlMatch = (path: string) => {
  const pathName = usePathname();
  return pathName.includes(path);
};

export const getVibrantColor = async (img: string) => {
  const palette = await Vibrant.from(img).getPalette();
  return {
    default: `rgb(${palette.Vibrant?.rgb.join(",")})`,
    light: `rgb(${palette.LightVibrant?.rgb.join(",")})`,
    dark: `rgb(${palette.DarkVibrant?.rgb.join(",")})`,
    mutedDark: `rgb(${palette.DarkMuted?.rgb.join(",")})`,
    mutedLight: `rgb(${palette.LightMuted?.rgb.join(",")})`,
    muted: `rgb(${palette.Muted?.rgb.join(",")})`,
  };
};

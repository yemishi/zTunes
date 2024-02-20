import { usePathname } from "next/navigation";

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

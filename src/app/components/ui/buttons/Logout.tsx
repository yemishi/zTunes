"use client";
import { signOut } from "next-auth/react";
import { RiLogoutCircleRLine } from "react-icons/ri";

interface ButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  iconLess?: boolean;
}

export default function Logout({ iconLess, ...props }: ButtonProps) {
  const { onClick, className, ...rest } = props;
  const defaultBg = className?.includes("bg") ? "" : "bg-gray-300 text-black";
  const defaultPadding = className?.includes("p-") ? "" : "p-2";
  const defaultFont = className?.includes("font-")
    ? ""
    : "font-mon font-semibold";
  const defaultTextSize = className?.includes("text") ? "" : "text-lg";

  const logout = () => {
    signOut();
  };

  return (
    <button
      onClick={logout}
      className={`${
        className ? className : ""
      } ${defaultBg} ${defaultFont} ${defaultPadding} ${defaultTextSize} hover:bg-opacity-80 active:scale-105 duration-150 flex items-center gap-2`}
      {...rest}
    >
      Logout {!iconLess && <RiLogoutCircleRLine className="size-6" />}
    </button>
  );
}

"use client";
import { signOut } from "next-auth/react";
import { RiLogoutCircleRLine } from "react-icons/ri";

interface ButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  iconLess?: boolean;
  animateLess?: boolean;
}

export default function Logout({ animateLess, iconLess, ...props }: ButtonProps) {
  const { onClick, className, ...rest } = props;
  const defaultBg = className?.includes("bg") ? "" : "bg-gray-300 text-black";
  const defaultPadding = className?.includes("p-") ? "" : "p-2";
  const defaultAnimate = animateLess ? "" : "active:scale-105 duration-150";
  const defaultFont = className?.includes("font-") ? "" : "font-mon font-semibold";
  const defaultTextSize = className?.includes("text") ? "" : "text-lg";

  const logout = () => {
    signOut();
  };

  return (
    <button
      onClick={logout}
      className={`${
        className ? className : ""
      } ${defaultBg} ${defaultFont} ${defaultPadding} ${defaultTextSize} ${defaultAnimate} hover:bg-opacity-80  flex items-center gap-2`}
      {...rest}
    >
      Logout {!iconLess && <RiLogoutCircleRLine className="size-6" />}
    </button>
  );
}

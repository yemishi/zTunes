import { ButtonHTMLAttributes } from "react";

import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isLoading?: boolean;
}

export default function Button({ className, isLoading, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const defaultBackDrop = className?.includes("bg-transparent") ? "" : "backdrop-brightness-50";
  const defaultBg = !className?.includes("bg") ? "bg-amber-500" : "";

  return (
    <Component
      {...props}
      className={`${
        className ? className : ""
      } ${defaultBackDrop} ${defaultBg}  cursor-pointer px-4 py-2 rounded-full border border-white border-opacity-30 font-kanit hover:backdrop-brightness-150
      disabled:animate-pulse duration-200 bg-opacity-75 hover:bg-opacity-85 border-none`}
    />
  );
}

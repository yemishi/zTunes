import { ButtonHTMLAttributes } from "react";

import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export default function Button({ className, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      {...props}
      className={`${
        className ? className : ""
      } px-4 py-2 rounded-full border border-white border-opacity-30 backdrop-brightness-50 font-kanit text-lg hover:backdrop-brightness-150
      disabled:animate-pulse duration-200 ${
        !className?.includes("bg") ? "bg-amber-500" : ""
      } bg-opacity-75 hover:bg-opacity-85 `}
    />
  );
}

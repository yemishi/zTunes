import { ButtonHTMLAttributes, ReactNode } from "react";

import { cleanClasses } from "@/utils/helpers";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children?: ReactNode;
}

export default function Button({ children, isLoading, ...props }: ButtonProps) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={cleanClasses(
        className,
        `cursor-pointer px-4 py-2 rounded-full text-black bg-amber-500 font-kanit hover:brightness-110 active:scale-90 transition-all disabled:grayscale ${
          isLoading ? "animate-pulse pointer-events-none" : ""
        }`
      )}
    >
      {children}
    </button>
  );
}

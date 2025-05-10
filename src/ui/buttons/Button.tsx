"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cleanClasses } from "@/utils/helpers";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children?: ReactNode;
  href?: string;
}

export default function Button({ children, isLoading, href, ...props }: ButtonProps) {
  const { className, ...rest } = props;
  const baseClasses = cleanClasses(
    className,
    `cursor-pointer px-4 py-2 rounded-full text-black bg-amber-500 font-kanit hover:brightness-110 active:scale-90 transition-all disabled:grayscale ${
      isLoading ? "animate-pulse pointer-events-none" : ""
    }`
  );
  return href ? (
    <Link href={href} className={baseClasses}>
      {children}
    </Link>
  ) : (
    <button {...rest} className={baseClasses}>
      {children}
    </button>
  );
}

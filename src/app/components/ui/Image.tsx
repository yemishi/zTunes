"use client";
import NextImage from "next/image";
import { HTMLAttributes, useState } from "react";

interface ImgProps extends HTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}

export default function Image({
  priority,
  className,
  src,
  ...props
}: ImgProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <NextImage
      {...props}
      draggable={false}
      src={src}
      alt=""
      priority={priority}
      
      onLoad={() => setIsLoading(false)}
      className={`${className ? className : ""} ${
        isLoading ? "brightness-50" : ""
      }  duration-100`}
      width={100}
      height={100}
    />
  );
}

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
  alt,
  ...props
}: ImgProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const parseAlt = (imageUrl: String) => {
    try {
      const parts = imageUrl.split("/");
      const fileName = parts[parts.length - 1];
      const altName = fileName.split("?")[0];
      return altName;
    } catch (error) {
      return "";
    }
  };
  return (
    <NextImage
      {...props}
      src={src}
      alt={isLoading ? alt || "image loading" : alt || parseAlt(src)}
      priority={priority}
      quality={100}
      height={500}
      width={500}
      onLoad={() => setIsLoading(false)}
      className={`${className ? className : ""} ${
        isLoading ? "brightness-50" : ""
      }  duration-100`}
    />
  );
}

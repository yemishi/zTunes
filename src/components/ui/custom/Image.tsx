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
  const generateAltText = (imageUrl: string): string => {
    const decoded = decodeURIComponent(imageUrl)
    const filename = decoded.substring(decoded.lastIndexOf("/") + 1);
    const filenameWithoutExtension = filename.split(".").slice(0, -1).join(" ");

    const formattedText = filenameWithoutExtension.replace(/[-_]/g, " ");
    const capitalizedText = formattedText.replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

    return capitalizedText;
  };

  return (
    <NextImage
      {...props}
      src={src}
      alt={alt || generateAltText(src)}
      priority={priority}
      quality={100}
      height={500}
      width={500}
      onLoad={() => setIsLoading(false)}
      className={`${className ? className : ""} ${isLoading ? "brightness-50" : ""
        }  duration-100`}
    />
  );
}

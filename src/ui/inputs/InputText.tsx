"use client";

import { ErrorType } from "@/types/response";
import { cleanClasses } from "@/utils/helpers";
import { useState } from "react";
import { toast } from "react-toastify";

interface InputTextProps extends React.HTMLAttributes<HTMLDivElement> {
  initialValue: string;
  changeable: boolean;
  preventDefaultBlur?: boolean;
  onblur?: (currValue: string) => void;
  patchUrl?: string;
  onSuccess?: () => Promise<void>;
  fieldType?: string;
  extraBody?: object;
  max?: number;
  min?: number;
  rows?: number;
}

export default function InputText({
  initialValue,
  changeable,
  preventDefaultBlur = false,
  onblur,
  onSuccess,
  patchUrl,
  fieldType,
  extraBody = {},
  rows = 1,
  max = 30,
  min = 1,
  className = "",
  ...rest
}: InputTextProps) {
  const [value, setValue] = useState<string>(initialValue);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleBlur = async () => {
    const trimmed = value.trim();
    setIsEditing(false);
    setValue(trimmed);

    if (trimmed === initialValue) return;

    if (trimmed.length < min) {
      setHasError(true);
      setIsEditing(true);
      return;
    }

    if (preventDefaultBlur) {
      onblur?.(trimmed);
      return;
    }

    if (!fieldType || !patchUrl) return;

    try {
      const body = {
        [fieldType]: trimmed,
        ...extraBody,
      };

      const response: ErrorType = await fetch(patchUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((res) => res.json());
      console.log(response);
      if (response.error) {
        setHasError(true);
        setIsEditing(true);
        toast.error(response.message || "Update failed");
        return;
      }
      setValue(trimmed);
      if (onSuccess) await onSuccess();
    } catch (err) {
      setHasError(true);
      toast.error("Network error. Try again.");
    }
  };

  return (
    <div
      {...rest}
      className={`${cleanClasses(className, "mt-3 text-3xl font-kanit")} ${hasError ? "text-red-500" : ""}`}
    >
      {isEditing && changeable ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\s\s+/g, " "))}
          onBlur={handleBlur}
          autoFocus
          rows={rows}
          maxLength={max}
          className="w-full overflow-hidden line-clamp-2 whitespace-pre-wrap outline-none resize-none text-center md:text-start"
        />
      ) : (
        <span
          onClick={() => changeable && setIsEditing(true)}
          className={`line-clamp-2 ${changeable ? "hover:text-gray-200 cursor-pointer transition-all" : ""}`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )}
    </div>
  );
}

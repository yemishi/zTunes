"use client";

import { ErrorType } from "@/types/response";
import { useState } from "react";
import { toast } from "react-toastify";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  initialValue: string;
  changeable: boolean;
  preventDefaultBlur?: boolean;
  onblur?: (currValue: string) => void;
  patchUrl?: string;
  fieldType?: string;
  extraBody?: object;
  max?: number;
  min?: number;
  rows?: number;
}

export default function InputText({
  preventDefaultBlur,
  fieldType,
  initialValue,
  changeable,
  patchUrl,
  extraBody,
  onblur,
  rows,
  max,
  min,
  ...props
}: DivProps) {
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<boolean>();
  const [isInput, setIsInput] = useState<boolean>(false);

  const onBlurDefault = async () => {
    setIsInput(false);
    setValue(value.trim());
    if (value === initialValue || !fieldType || preventDefaultBlur) return;
    try {
      const body = {
        [fieldType]: value,
        ...extraBody,
      };
      const data: ErrorType = await fetch(`${patchUrl}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }).then((res) => res.json());

      const { error, message } = data;
      if (error) setError(true), toast.error(message), setIsInput(true);
    } catch (error) {
      setError(true);
    }
  };

  const errorClass = error ? "text-red-500" : "";
  const defaultTextSize = props.className?.includes("text-") ? "" : "text-3xl";
  const defaultFont = props.className?.includes("font-") ? "" : "font-kanit";

  const Span = (
    <span onClick={() => setIsInput(true)} className="line-clamp-2">
      {value.charAt(0).toUpperCase() + value.slice(1)}
    </span>
  );
  const fnc = () => {
    if (value.length < (min || 1)) return setError(true), setIsInput(true);

    return onblur
      ? (onblur(value.trim()), setValue(value.trim()), setIsInput(false))
      : onBlurDefault();
  };

  const Input = (
    <textarea
      onBlur={fnc}
      rows={rows || 2}
      minLength={3}
      maxLength={max || 30}
      autoFocus
      value={value}
      onChange={(e) => {
        setError(false), setValue(e.target.value.replaceAll("  ", " "));
      }}
      className="bg-transparent outline-none w-full line-clamp-2 resize-none text-center md:text-start"
    />
  );

  return (
    <div
      {...props}
      className={`${
        props.className ? props.className : ""
      } ${errorClass} ${defaultTextSize} ${defaultFont}
  mt-3`}
    >
      {isInput && changeable ? Input : Span}
    </div>
  );
}

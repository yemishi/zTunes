"use client";
import { cleanClasses } from "@/utils/helpers";
import { InputHTMLAttributes, forwardRef, useEffect, useRef, useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  borderColor?: string;
  isPassword?: boolean;
  disableErrorMsg?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, className, placeholder, id, isPassword, error, disableErrorMsg, borderColor, ...rest } = props;
  const [isPass, setIsPass] = useState(isPassword);

  const PassIcon = isPass ? FaEyeSlash : IoEyeSharp;

  const type = isPass ? "password" : rest.type || "text";

  const labelRef = useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    if (labelRef.current) {
      setLabelWidth(labelRef.current.offsetWidth);
    }
  }, [label]);

  const hasValue = !!rest.value;
  return (
    <div
      className={`${cleanClasses(
        className,
        `${
          borderColor ? `border-${borderColor}` : ""
        } flex border-r-2 lg:text-lg flex-col group focus-within:border-amber-500 border-t-0 gap-1 border font-kanit relative p-3 
         border-b-2 rounded-full group focus-within:border-secondary-400`
      )} ${error ? "border-red-400 text-red-400" : ""} ${hasValue ? "border-blue-400" : ""} `}
    >
      <div
        className={`${
          borderColor ? `border-${borderColor}` : ""
        } absolute top-0 rounded-full border-t-2 pointer-events-none group group-focus-within:border-amber-500 border-r -right-0.5 h-full duration-100 ${
          hasValue ? "rounded-l-none border-blue-400 " : ""
        } ${error ? "border-red-400 !w-0 !border-r-0" : " "}`}
        style={{
          width: hasValue ? `calc(100% - ${labelWidth}px - 20px)` : "101%",
        }}
      />
      <label
        ref={labelRef}
        htmlFor={id || rest.name}
        className={`absolute left-4 bottom-2.5 origin-left duration-100  ${
          hasValue ? "-translate-y-6 scale-90 font-light translate-x-1.5 md:-translate-y-7.5" : "pointer-events-none"
        }`}
      >
        {label || placeholder}
      </label>
      <input
        type={type}
        id={id || rest.name}
        className={`w-full h-full outline-none px-1 ${isPass ? "" : "pr-6"}`}
        ref={ref}
        {...rest}
      />
      {isPassword && (
        <span onClick={() => setIsPass(!isPass)} className="absolute top-2/4 -translate-y-2/4 right-3 cursor-pointer">
          <PassIcon className="w-6 h-6" />
        </span>
      )}
      {error && !disableErrorMsg && (
        <span className="ml-1 text-sm lg:text-lg text-red-500 absolute -top-3 right-5 scale-90 origin-right md:right-7 md:text-base">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;

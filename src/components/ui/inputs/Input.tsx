import { cleanClasses } from "@/utils/helpers";
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  info?: string;
  noMessage?: boolean;
  isPassword?: boolean;
  classNameInput?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, icon, className, info="very very good input to input it", error, id, isPassword, noMessage, classNameInput, ...rest } = props;

  const [isPass, setIsPass] = useState<boolean>(true);

  const PassIcon = isPass ? FaEyeSlash : IoEyeSharp;

  const checkType = isPassword ? (isPass ? "password" : "text") : undefined;

  return (
    <div className="flex flex-col gap-1 font-kanit text-left">
      <span>
        <label className="text-gray-200" htmlFor={id || rest.name} aria-label={rest.name}>
          {label}
        </label>
        {info && <p className="text-gray-400 text-sm">{info}</p>}
      </span>

      <span
        className={`text-lg relative text-white rounded-md w-full 
       ${icon && "relative"}`}
      >
        <input
          type={checkType}
          id={id || rest.name}
          className={`${cleanClasses(
            className,
            "w-full h-full inputForm bg-black bg-opacity-45 focus:bg-opacity-65 border-opacity-55 border border-white"
          )} ${error ? "!border-red-500 border" : ""}`}
          ref={ref}
          {...rest}
        />
        {icon}
        {isPassword && (
          <span onClick={() => setIsPass(!isPass)} className="absolute top-2/4 -translate-y-2/4 right-2 cursor-pointer">
            <PassIcon className="w-6 h-6" />
          </span>
        )}
      </span>
      {error && !noMessage && <span className="ml-1 text-sm text-red-500">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;

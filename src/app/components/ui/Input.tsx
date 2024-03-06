import { InputHTMLAttributes, forwardRef, useState } from "react";
import { FieldError } from "react-hook-form";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError | undefined;
  icon?: React.ReactNode;
  info?: string;
  noMessage?: boolean;
  isPassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    label,
    icon,
    className,
    info,
    error,
    id,
    isPassword,
    noMessage,
    ...rest
  } = props;
  const [isPass, setIsPass] = useState<boolean>(true);

  const passIcon = (
    <span
      onClick={() => setIsPass(!isPass)}
      className="absolute top-2/4 -translate-y-2/4 right-2 cursor-pointer"
    >
      {isPass ? (
        <FaEyeSlash className="w-6 h-6" />
      ) : (
        <IoEyeSharp className="w-6 h-6" />
      )}
    </span>
  );

  const checkType = isPassword ? (isPass ? "password" : "text") : undefined;

  return (
    <span className={`${className} flex flex-col gap-1 font-kanit text-left `}>
      <span>
        <label
          className="text-gray-200"
          htmlFor={id || rest.name}
          aria-label={rest.name}
        >
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
          className={`w-full h-full inputForm  ${
            error ? "border-red-500" : "border-white"
          }`}
          ref={ref}
          {...rest}
        />
        {icon}
        {isPassword && passIcon}
      </span>
      {error?.message && !noMessage && (
        <span className="ml-1  text-sm text-red-500">{error.message}</span>
      )}
    </span>
  );
});

Input.displayName = "Input";

export default Input;

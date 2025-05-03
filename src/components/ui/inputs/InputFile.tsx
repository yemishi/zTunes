import { HTMLAttributes, forwardRef } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { FiMusic } from "react-icons/fi";

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconType: "song" | "cam";
}

const InputFile = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, onChange, iconType, ...rest } = props;
  const Icon = iconType === "cam" ? IoCameraOutline : FiMusic;
  const defaultSize =
    className?.includes("h-") ||
      className?.includes("w-") ||
      className?.includes("size-")
      ? ""
      : "size-12";
  return (
    <label
      htmlFor="file"
      className={`${className ? className : ""}
      ${defaultSize} ${className?.includes("bg-") ? "" : "bg-gray-200"
        } p-3 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-95 active:scale-105 duration-150`}
    >
      <input
        ref={ref}
        type="file"
        className="hidden"
        data-testid="inputFile"
        id="file"
        onChange={onChange}
        {...rest}
      />

      <Icon className="w-full h-full text-black" />
    </label>
  );
});

export default InputFile;

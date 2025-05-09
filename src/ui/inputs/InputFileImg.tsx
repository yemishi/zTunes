import { toast } from "react-toastify";
import InputFile from "./InputFile";

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  error?: boolean;
  demoPhoto?: string;
  isLoading?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputFileImg({ error, demoPhoto, isLoading, onChange, ...props }: InputProps) {
  const { className, onMouseEnter, onMouseLeave, ...rest } = props;

  const defaultSize = className?.includes("h-") || className?.includes("size") ? "" : "h-52";
  const defaultRadius = className?.includes("rounded") ? "" : "rounded-lg";
  return (
    <div
      style={{
        background: demoPhoto ? `url(${demoPhoto})` : "",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${
        className ? className : ""
      } ${defaultSize} ${defaultRadius} !bg-center !bg-cover flex items-center justify-center ${
        error ? "border border-red-500" : ""
      }`}
    >
      <InputFile
        className={isLoading ? "animate-pulse pointer-events-none" : ""}
        iconType="cam"
        onChange={(e) => {
          if (!e.target) return;
          if (!e.target.files || !e.target.files[0].type.startsWith("image/")) return toast.error("Invalid image type");
          onChange ? onChange(e) : null;
        }}
        {...rest}
      />
    </div>
  );
}

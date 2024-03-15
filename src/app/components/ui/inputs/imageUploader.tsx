import InputFile from "./InputFile";

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  error: boolean;
  demoPhoto?: string;
  isLoading?: boolean;
}

export default function InputFileImg({
  error,
  demoPhoto,
  isLoading,
  ...props
}: InputProps) {
  const { className, onMouseEnter, onMouseLeave, ...rest } = props;

  const defaultSize =
    className?.includes("h-") || className?.includes("size") ? "" : "h-52";
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
        {...rest}
      />
    </div>
  );
}

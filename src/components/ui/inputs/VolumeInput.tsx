import { useState } from "react";
import ProgressBar from "./ProgressBar";
import { ImVolumeMedium, ImVolumeMute2 } from "react-icons/im";

interface InputType extends React.HTMLAttributes<HTMLInputElement> {
  currentProgress: number;
  vertical?: boolean;
  value?: number;
  fixed?: boolean;
  barClass?: string;
}

export default function VolumeInput({
  vertical,
  currentProgress,
  className,
  value,
  fixed,
  barClass,
  ...props
}: InputType) {
  const [showInput, setShowInput] = useState<boolean>(false);
  const Icon = value === 0 ? ImVolumeMute2 : ImVolumeMedium;

  return (
    <div
      className={`${className ? className : ""} flex items-center`}
      onMouseLeave={() => (!fixed ? setShowInput(false) : null)}
      onMouseEnter={() => (!fixed ? setShowInput(true) : null)}
    >
      <Icon className="size-8" />
      {(showInput || fixed) && (
        <ProgressBar
          max={1}
          min={0}
          step={0.01}
          value={value}
          vertical={vertical}
          classContainer={`${barClass ? barClass : ""}`}
          currentProgress={currentProgress}
          {...props}
        />
      )}
    </div>
  );
}

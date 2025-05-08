import { HTMLAttributes } from "react";
import Input from "./Input";
import SelectMonth from "./SelectMonth";
import { lastDayOfMonth, format } from "date-fns";

interface PropsType extends HTMLAttributes<HTMLDivElement> {
  setValue: (fieldName: string, value: string) => void;
  values: {
    day: string;
    month: string;
    year: string;
  };
  errors: Record<string, string | null>;
  optionsClassName?: string;
  isLoading?: boolean;
}

export default function DateFields({ errors, values, isLoading, setValue, optionsClassName, ...props }: PropsType) {
  const { day, month, year } = values;
  const { className = "" } = props;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValue(name, name === "day" ? handleLimitDay(value) : name === "year" ? handleLimitYear(value) : value);
  };

  const lastDay = format(lastDayOfMonth(new Date(Number(year), Number(month))), "d");

  const handleLimitDay = (value: string) => {
    if (Number(value) >= Number(lastDay)) {
      return lastDay;
    } else {
      return value || "";
    }
  };

  const handleLimitYear = (value: string) => {
    if (value.length > 4) return value.slice(0, 4);
    else {
      return value || "";
    }
  };
  return (
    <div className="grid grid-cols-[1fr_2fr_1.5fr] gap-3 relative">
      <Input
        disabled={isLoading}
        className={className}
        required
        label="Day"
        id="day"
        placeholder="dd"
        type="number"
        autoComplete="day"
        inputMode="numeric"
        disableErrorMsg
        error={errors?.day || ""}
        value={day}
        name="day"
        onChange={handleInput}
      />

      <SelectMonth
        optionsClassName={optionsClassName}
        className={className}
        onChange={handleInput}
        disabled={isLoading}
        error={errors?.day || ""}
        id="month"
        name="month"
        required
      />

      <Input
        className={className}
        required
        disabled={isLoading}
        label="Year"
        placeholder="yyyy"
        name="year"
        inputMode="numeric"
        type="number"
        value={year}
        disableErrorMsg
        error={errors?.day || ""}
        onChange={handleInput}
        autoComplete="year"
      />
    </div>
  );
}

import { HTMLAttributes } from "react";
import Input from "./Input";
import SelectMonth from "./SelectMonth";
import { lastDayOfMonth, format } from "date-fns";

interface PropsType extends HTMLAttributes<HTMLDivElement> {
  setValue: (fieldName: string, value: string) => void;
  errors?: Record<string, string | null>;
  values: {
    bDay: string;
    bMonth: string;
    bYear: string;
  };
  isLoading?: boolean;
}

export default function DateFields({ errors, values, isLoading, setValue, ...props }: PropsType) {
  const { bDay, bMonth, bYear } = values;
  const { className } = props;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValue(name, name === "day" ? handleLimitDay(value) : name === "bYear" ? handleLimitYear(value) : value);
  };

  const lastDay = format(lastDayOfMonth(new Date(Number(bYear), Number(bMonth))), "d");

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
    <div className="grid grid-cols-[1fr_2fr_1.5fr] gap-3">
      <Input
        disabled={isLoading}
        noMessage
        required
        label=""
        id="day"
        placeholder="dd"
        type="number"
        autoComplete="bDay"
        inputMode="numeric"
        error={errors?.bDay || ""}
        value={bDay}
        name="bDay"
        onChange={handleInput}
      />

      <SelectMonth
        className={className ? className : ""}
        onChange={handleInput}
        disabled={isLoading}
        error={errors?.bDay || ""}
        id="bMonth"
        name="bMonth"
        required
      />

      <Input
        className={className ? className : ""}
        required
        disabled={isLoading}
        noMessage
        label=""
        placeholder="yyyy"
        name="bYear"
        inputMode="numeric"
        type="number"
        value={bYear}
        error={errors?.bDay || ""}
        onChange={handleInput}
        autoComplete="bYear"
      />
    </div>
  );
}

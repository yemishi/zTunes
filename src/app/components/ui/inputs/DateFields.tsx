import Input from "./Input";
import SelectMonth from "./SelectMonth";
import { lastDayOfMonth, format } from "date-fns";

type PropsType = {
  errors?: {
    day?: string | undefined;
    month?: string | undefined;
    year?: string | undefined;
  };
  values: {
    day: string;
    month: string;
    year: string;
  };
  setValues: React.Dispatch<
    React.SetStateAction<{
      day: string;
      month: string;
      year: string;
      [key: string]: any;
    }>
  >;
  isLoading?: boolean;
};

export default function DateFields({
  errors,
  values,
  isLoading,
  setValues,
}: PropsType) {
  const { day, month, year } = values;
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]:
        name === "day"
          ? handleLimitDay(value)
          : name === "year"
          ? handleLimitYear(value)
          : value,
    });
  };

  const lastDay = format(
    lastDayOfMonth(new Date(Number(year), Number(month))),
    "d"
  );

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
        autoComplete="day"
        inputMode="numeric"
        error={errors?.day}
        value={day}
        name="day"
        onChange={handleInput}
      />

      <SelectMonth
        onChange={handleInput}
        disabled={isLoading}
        error={errors?.month}
        id="month"
        name="month"
        required
      />

      <Input
        required
        disabled={isLoading}
        noMessage
        label=""
        placeholder="yyyy"
        inputMode="numeric"
        type="number"
        value={year}
        error={errors?.year}
        onChange={handleInput}
        autoComplete="year"
        name="year"
      />
    </div>
  );
}

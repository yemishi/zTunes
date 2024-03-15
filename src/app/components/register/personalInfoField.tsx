import { RegisterPropsType, RegisterResponseType } from "./types/registerTypes";
import Button from "../ui/buttons/Button";
import Input from "../ui/inputs/Input";
import { ChangeEvent, useState } from "react";
import { format, lastDayOfMonth } from "date-fns";
import { IoAlertCircleOutline } from "react-icons/io5";
import DivAnimated from "../ui/DivAnimated";
import SelectMonth from "../ui/inputs/SelectMonth";

export default function PersonalInfoField({
  error,
  onNext,
  register,
  setError,
  trigger,
  setValue,
  errors,
  value,
}: RegisterPropsType) {
  const [birthDate, setBirthDate] = useState<{
    bday: string;
    month: string;
    bdayYear: string;
  }>({
    bday: "",
    month: "",
    bdayYear: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBirthDate({
      ...birthDate,
      [name]:
        name === "bday"
          ? handleLimitDay(value)
          : name === "bdayYear"
          ? handleLimitYear(value)
          : value,
    });
  };

  const lastDay = format(
    lastDayOfMonth(
      new Date(Number(birthDate.bdayYear), Number(birthDate?.month))
    ),
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

  const handleNext = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (birthDate.bday > lastDay) {
      return setError("bDay", { message: "The day field needs to be valid." });
    }
    if (setValue) {
      setValue("bYear", birthDate.bdayYear);
      setValue("bDay", birthDate.bday);
      setValue("bMonth", birthDate.month);
    }
    const checkValues = await trigger(["bDay", "bMonth", "bYear", "name"]);
    if (!checkValues) return;

    setIsLoading(true);
    const { error, message }: RegisterResponseType = await (
      await fetch(`/api/user?value=${value}&field=username`)
    ).json();
    if (error) {
      setIsLoading(false);
      return setError("name", { message: message });
    }
    setIsLoading(false);
    onNext();
  };

  return (
    <DivAnimated key="personalField" className="flex flex-col gap-6">
      <Input
        autoFocus
        disabled={isLoading}
        {...register("name")}
        error={error}
        label="Name"
        placeholder="Mohammed"
        autoComplete="display_name"
        type="text"
        info="This name will appear on your profile"
      />

      <div className="font-kanit flex flex-col">
        <span className="self-start text-left">
          <label className="font-medium" htmlFor="bday">
            Date of birth
          </label>

          <p className="text-gray-400 text-sm">
            This is necessary for a personalized experience
          </p>
        </span>

        <span className="grid grid-cols-[1fr_2fr_1.5fr] gap-3 ">
          <Input
            disabled={isLoading}
            noMessage
            label=""
            id="bday"
            placeholder="dd"
            type="number"
            autoComplete="bday-day"
            inputMode="numeric"
            error={errors?.bDay}
            value={birthDate.bday}
            name="bday"
            onChange={handleInput}
          />

          <SelectMonth
            onChange={handleInput}
            disabled={isLoading}
            error={errors?.bMonth && true}
            id="month"
            name="month"
          />

          <Input
            disabled={isLoading}
            noMessage
            label=""
            placeholder="yyyy"
            inputMode="numeric"
            type="number"
            value={birthDate.bdayYear}
            error={errors?.bYear}
            onChange={handleInput}
            autoComplete="bday-year"
            name="bdayYear"
          />
        </span>

        <div className="text-red-500 self-star text-left mt-2 text-sm">
          {errors?.bDay && (
            <span className="flex gap-1 items-center">
              <IoAlertCircleOutline className="w-4 h-4" />
              <p>{errors?.bDay?.message}</p>
            </span>
          )}
          {errors?.bMonth && (
            <span className="flex gap-1 items-center">
              <IoAlertCircleOutline className="w-4 h-4" />
              <p>{errors?.bMonth?.message}</p>
            </span>
          )}
          {errors?.bYear && (
            <span className="flex gap-1 items-center">
              <IoAlertCircleOutline className="w-4 h-4" />
              <p>{errors?.bYear?.message}</p>
            </span>
          )}
        </div>
      </div>

      <Button
        disabled={isLoading}
        onClick={handleNext}
        type="submit"
        className="text-black"
      >
        Next
      </Button>
    </DivAnimated>
  );
}

import Input from "../ui/inputs/Input";
import { IoAlertCircleOutline } from "react-icons/io5";
import DateFields from "../ui/inputs/DateFields";
import { ChangeEventHandler } from "react";

interface Props {
  setValue: (fieldName: string, value: string) => void;
  birthDate: {
    bDay: string;
    bMonth: string;
    bYear: string;
  };
  nameOnChange: ChangeEventHandler<HTMLInputElement>;
  nameValue?: string;
  errors?: Record<string, string | null>;
}

export default function PersonalInfoField({ nameOnChange, nameValue, errors, setValue, birthDate }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <Input
        autoFocus
        onChange={nameOnChange}
        label="Name"
        value={nameValue}
        name="name"
        placeholder="Mohammed"
        error={errors?.name || ""}
        autoComplete="display_name"
        type="text"
        info="This name will appear on your profile"
      />

      <div className="font-kanit flex flex-col">
        <span className="self-start text-left">
          <label className="font-medium" htmlFor="bday">
            Date of birth
          </label>

          <p className="text-gray-400 text-sm">This is necessary for a personalized experience</p>
        </span>

        <DateFields setValue={setValue} values={birthDate} errors={errors} />

        <div className="text-red-500 self-star text-left mt-2 text-sm">
          {errors?.bDay && (
            <span className="flex gap-1 items-center">
              <IoAlertCircleOutline className="w-4 h-4" />
              <p>{errors?.bDay}</p>
            </span>
          )}
          {errors?.bMonth && (
            <span className="flex gap-1 items-center">
              <IoAlertCircleOutline className="w-4 h-4" />
              <p>{errors?.bMonth}</p>
            </span>
          )}
          {errors?.bYear && (
            <span className="flex gap-1 items-center">
              <IoAlertCircleOutline className="w-4 h-4" />
              <p>{errors?.bYear}</p>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

import Input from "../../../../../../ui/inputs/Input";
import { IoAlertCircleOutline } from "react-icons/io5";
import DateFields from "../../../../../../ui/inputs/DateFields";
import { ChangeEventHandler } from "react";

interface Props {
  setValue: (fieldName: string, value: string) => void;
  birthDate: {
    day: string;
    month: string;
    year: string;
  };
  nameOnChange: ChangeEventHandler<HTMLInputElement>;
  nameValue?: string;
  errors: Record<string, string | null>;
}

export default function SignUpUserInfo({ nameOnChange, nameValue, errors, setValue, birthDate }: Props) {
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
      />

      <div className="font-kanit flex flex-col gap-3">
        <DateFields setValue={setValue} values={birthDate} errors={errors} />

        <div className="text-red-500 mt-1 text-sm space-y-1">
          {[errors?.bYear, errors?.bMonth, errors?.bDay].filter(Boolean).map((err, idx) => (
            <div key={idx} className="flex gap-1 items-center">
              <IoAlertCircleOutline className="w-4 h-4" />
              <p>{err}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

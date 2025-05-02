import { RegisterInputsType, RegisterPropsType } from "./types/registerTypes";
import Input from "../ui/inputs/Input";
import { Dispatch, SetStateAction, useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import DivAnimated from "../ui/custom/DivAnimated";
import DateFields from "../ui/inputs/DateFields";
import { FieldError, FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  error: FieldError | undefined;
  register: UseFormRegister<RegisterInputsType>;
  errors?: FieldErrors<RegisterInputsType>;
  birthDate: { day: string; month: string; year: string };
  setBirthDate: Dispatch<
    SetStateAction<{
      day: string;
      month: string;
      year: string;
    }>
  >;
}

export default function PersonalInfoField({ error, register, errors, setBirthDate, birthDate }: Props) {
  return (
    <DivAnimated key="personalField" className="flex flex-col gap-6">
      <Input
        autoFocus
        {...register("name")}
        error={error?.message}
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

          <p className="text-gray-400 text-sm">This is necessary for a personalized experience</p>
        </span>

        <DateFields
          setValues={setBirthDate}
          values={birthDate}
          errors={{
            day: errors?.bDay as string | undefined,
            month: errors?.bMonth as string | undefined,
            year: errors?.bYear as string | undefined,
          }}
        />

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
    </DivAnimated>
  );
}

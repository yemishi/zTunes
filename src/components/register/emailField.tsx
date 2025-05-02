import { RegisterPropsType } from "./types/registerTypes";
import { useState } from "react";
import DivAnimated from "../ui/custom/DivAnimated";
import Input from "../ui/inputs/Input";
import Button from "../ui/buttons/Button";
import { ErrorType } from "@/types/response";

export default function EmailField({ error, register, trigger, value, setError, onNext }: RegisterPropsType) {
  return (
    <DivAnimated key="email-field" className="flex flex-col h-full gap-6 mt-5">
      <Input autoFocus {...register("email")} label="Email" placeholder="Mohammed@gmail.com" error={error?.message} />
    </DivAnimated>
  );
}

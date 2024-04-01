import { RegisterPropsType } from "./types/registerTypes";
import { useState } from "react";
import Link from "next/link";
import DivAnimated from "../ui/custom/DivAnimated";
import Input from "../ui/inputs/Input";
import Button from "../ui/buttons/Button";
import { ErrorType } from "@/types/response";

export default function EmailField({
  error,
  register,
  trigger,
  value,
  setError,
  onNext,
}: RegisterPropsType) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNext = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const isEmail = await trigger("email");
    if (isEmail) {
      setIsLoading(true);
      const existingEmail: ErrorType = await (
        await fetch(`/api/user/validation?value=${value}&field=email`)
      ).json();
      if (!existingEmail.error) {
        setIsLoading(false);
        return onNext();
      }
      setIsLoading(false);
      setError("email", { message: existingEmail.message as string });
    }
  };

  return (
    <DivAnimated className="flex flex-col h-full gap-6 mt-5">
      <Input
        autoFocus
        disabled={isLoading}
        {...register("email")}
        label="Email"
        placeholder="Mohammed@gmail.com"
        error={error?.message}
      />
      <Button
        onClick={handleNext}
        type="submit"
        disabled={isLoading}
        className="text-black mt-auto"
      >
        Next
      </Button>

      <div className="w-full mb-2 h-[1px] bg-white bg-opacity-20" />

      <div className="w-full h-[1px] bg-white bg-opacity-20" />

      <span className="font-kanit text-gray-400">
        Already have an account?
        <Link
          href={"/sign-in"}
          className="text-white underline underline-offset-4 ml-1"
        >
          Log in here.
        </Link>
      </span>
    </DivAnimated>
  );
}

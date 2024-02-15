import { FacebookButton, GoogleButton } from "../ui/AuthButtons";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Link from "next/link";
import { RegisterPropsType, RegisterResponseType } from "./types/registerTypes";
import DivAnimated from "../ui/DivAnimated";
import { useState } from "react";

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
      const existingEmail: RegisterResponseType = await (
        await fetch(`/api/user?value=${value}&field=email`)
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
    <DivAnimated key="emailField" className="flex flex-col gap-6 h-full mt-5">
      <Input
        autoFocus
        disabled={isLoading}
        {...register("email")}
        label="Email"
        placeholder="Mohammed@gmail.com"
        error={error}
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

      <div className="flex flex-col gap-1">
        <FacebookButton disabled={isLoading}>
          Sign up with Facebook
        </FacebookButton>
        <GoogleButton>Sign up with Google</GoogleButton>
      </div>

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

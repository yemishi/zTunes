"use client";

import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

import Button from "../ui/buttons/Button";
import Input from "../ui/inputs/Input";
import useForm from "@/hooks/useForm";
import { IoIosArrowBack } from "react-icons/io";

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPass, setIsPass] = useState<boolean>(true);

  const { push } = useRouter();
  const {
    values: { name, password },
    onChange,
    errors,
    setError,
    validateAll,
  } = useForm<{ name: string; password: string }>({
    name: { value: "", min: 1 },
    password: { value: "", min: 6, minMessage: "This field must have at least 6 characters" },
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    const response = await signIn("credentials", {
      name,
      password,
      redirect: false,
    });
    if (response && !response.ok) {
      setError("name", "Incorrect username or password.");
      setError("password", "Incorrect username or password.");
    } else push("/");
    setIsLoading(false);
  };

  const icon = (
    <span onClick={() => setIsPass(!isPass)} className="absolute top-2/4 -translate-y-2/4 right-2 cursor-pointer">
      {isPass ? <FaEyeSlash className="w-6 h-6" /> : <IoEyeSharp className="w-6 h-6" />}
    </span>
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 h-full">
      <div className="flex flex-col gap-3 ">
        <div className="self-start flex gap-2 items-center">
          <IoIosArrowBack className="size-7 opacity-70 pointer-events-none" />

          <span className="flex flex-col">
            <p className="text-orange">{`Step 1 of 1`}</p>
            <p className="font-medium text-amber-300">Welcome back! Log in to access your account.</p>
          </span>
        </div>
      </div>

      <Input
        disabled={isLoading}
        onChange={onChange}
        type="text"
        name="name"
        autoComplete="display_name"
        placeholder="Email or username"
        label="Email or username"
        error={errors.name || ""}
      />

      <Input
        disabled={isLoading}
        name="password"
        onChange={onChange}
        error={errors.password || ""}
        isPassword
        label="Password"
      />

      <Button disabled={isLoading} type="submit" className="text-black mt-auto mx-auto mb-7">
        Log in
      </Button>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

import Button from "@/ui/buttons/Button";
import Input from "@/ui/inputs/Input";
import useForm from "@/hooks/useForm";
import ProgressStep from "@/ui/custom/ProgressStep";

export default function SignInForm({ resetPass }: { resetPass: () => void }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    if (!validateAll()) return;
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

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 h-full ">
      <ProgressStep step={0} totalSteps={0} desc="Welcome back! Log in to access your account." goBack={() => {}} />
      <Input
        disabled={isLoading}
        onChange={onChange}
        value={name}
        type="text"
        name="name"
        autoFocus
        autoComplete="display_name"
        placeholder="Email or username"
        label="Email or username"
        error={errors.name || ""}
      />

      <Input
        disabled={isLoading}
        value={password}
        name="password"
        onChange={onChange}
        error={errors.password || ""}
        isPassword
        label="Password"
      />
      <button
        onClick={resetPass}
        type="button"
        className="underline mx-auto underline-offset-2 md:underline-offset-4 max-md:tracking-tighter text-white hover:text-amber-300 transition-all cursor-pointer"
      >
        Forgot your password?
      </button>
      <Button disabled={isLoading} type="submit" className="text-black mt-auto mx-auto mb-7">
        Log in
      </Button>
    </form>
  );
}

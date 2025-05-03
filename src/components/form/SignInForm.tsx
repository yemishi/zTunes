"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import Button from "../ui/buttons/Button";
import Input from "../ui/inputs/Input";

export default function SignInForm() {
  type InputsType = z.infer<typeof FormSchema>;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPass, setIsPass] = useState<boolean>(true);

  const FormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    password: z.string().min(1, "Password is required"),
  });
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<InputsType>({ resolver: zodResolver(FormSchema) });

  const onSubmit: SubmitHandler<InputsType> = async (values) => {
    FormSchema.parse(values);
    setIsLoading(true);
    const response = await signIn("credentials", {
      name: values.name,
      password: values.password,
      redirect: false,
    });
    if (response && !response.ok) {
      setError("name", { message: "Incorrect username or password." });
      setError("password", { message: "Incorrect username or password." });
    } else push("/");
    setIsLoading(false);
  };

  const icon = (
    <span onClick={() => setIsPass(!isPass)} className="absolute top-2/4 -translate-y-2/4 right-2 cursor-pointer">
      {isPass ? <FaEyeSlash className="w-6 h-6" /> : <IoEyeSharp className="w-6 h-6" />}
    </span>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 h-full">
      <Input
        disabled={isLoading}
        {...register("name")}
        type="text"
        autoComplete="display_name"
        placeholder="Email or username"
        label="Email or username"
        error={errors.name?.message}
      />

      <Input
        disabled={isLoading}
        {...register("password")}
        error={errors.password?.message}
        label="Password"
        type={isPass ? "password" : "text"}
        icon={icon}
        placeholder="Password"
      />

      <Button disabled={isLoading} type="submit" className="text-black mt-auto mx-auto mb-7">
        Log in
      </Button>
    </form>
  );
}

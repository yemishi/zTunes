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
import DivAnimated from "../ui/custom/DivAnimated";

export default function LoginForm({ close }: { close: () => void }) {
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
    <span
      onClick={() => setIsPass(!isPass)}
      className="absolute top-2/4 -translate-y-2/4 right-2 cursor-pointer"
    >
      {isPass ? (
        <FaEyeSlash className="w-6 h-6" />
      ) : (
        <IoEyeSharp className="w-6 h-6" />
      )}
    </span>
  );

  return (
    <DivAnimated className="flex flex-col gap-2">
      <h1 className="text-3xl font-montserrat font-bold self-start tracking-tighter">
        Log in to zTunes
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="w-full my-4 h-[1px] bg-white bg-opacity-20" />

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

        <Button
          disabled={isLoading}
          type="submit"
          className="rounded-full bg-amber-500 bg-opacity-50 text-black border-none mt-4"
        >
          Log in
        </Button>
      </form>

      <button
        onClick={close}
        className="underline font-kanit tracking-tighter underline-offset-4 mt-auto hover:text-orange-600"
      >
        Forgot your password?
      </button>
    </DivAnimated>
  );
}

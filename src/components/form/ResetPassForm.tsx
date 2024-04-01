"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../ui/buttons/Button";
import Input from "../ui/inputs/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import DivAnimated from "../ui/custom/DivAnimated";
import Link from "next/link";

export default function ResetPassForm({ userId }: { userId: string }) {
  const [response, setResponse] = useState<{
    error: boolean;
    message: string;
  } | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormType = z.infer<typeof FormSchema>;
  const FormSchema = z
    .object({
      password: z.string().min(6, "This field must have at least 6 letters"),
      confirmPass: z.string().min(6, "This field must have at least 6 letters"),
    })
    .refine(({ confirmPass, password }) => confirmPass === password, {
      path: ["confirmPass"],
      message: "This field needs to be the same as the other",
    });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormType>({ resolver: zodResolver(FormSchema) });

  const onSubmit: SubmitHandler<FormType> = async (values) => {
    FormSchema.parse(values);
    const body = { password: values.password, userId };
    setIsLoading(true);
    const data: { message: string; error: boolean } = await fetch(
      "/api/user/password-reset",
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    ).then((res) => res.json());
    setResponse(data);
    setIsLoading(false);
  };

  return (
    <>
      <div className="formContainer fixed">
        <AnimatePresence initial={false} mode="wait">
          {response ? (
            <DivAnimated reverse className="flex flex-col  gap-6 ">
              <h1 className="text-3xl font-montserrat font-bold  tracking-tighter">
                {response.error ? "Something went wrong" : " Password changed"}
              </h1>

              <span className="flex flex-col gap-2 text-gray-300">
                <p className="self-start">{response.message}</p>
                {!response.error && (
                  <p className="self-start ">
                    Thank you for choosing our services. You can now proceed to{" "}
                    <Link className="font-bold" href="/sign-in">
                      log in
                    </Link>{" "}
                    with your new password.
                  </p>
                )}
              </span>
              {response.error ? (
                <Button onClick={() => setResponse(null)}>try again</Button>
              ) : (
                <Button asChild className="mt-10">
                  <Link href="/sign-in">Login</Link>
                </Button>
              )}
            </DivAnimated>
          ) : (
            <DivAnimated key="formResetPass">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
              >
                <h1 className="text-3xl font-montserrat font-bold self-start tracking-tighter ">
                  Reset your password
                </h1>
                <p className="self-start">
                  Please enter your new password below.
                </p>
                <Input
                  disabled={isLoading}
                  isPassword
                  autoFocus
                  {...register("password")}
                  error={errors.password?.message}
                  label="New password"
                />

                <Input
                  disabled={isLoading}
                  isPassword
                  {...register("confirmPass")}
                  error={errors.confirmPass?.message}
                  label="Confirm new password"
                />
                <Button type="submit" className="mt-10">
                  Change password
                </Button>
              </form>
            </DivAnimated>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

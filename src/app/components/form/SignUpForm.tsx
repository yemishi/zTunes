"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { lazy, useState } from "react";
import { AnimatePresence } from "framer-motion";

import EmailField from "../register/emailField";

const PassField = lazy(() => import("../register/passField"));
const PersonalInfoField = lazy(() => import("../register/personalInfoField"));
const ConfirmInfo = lazy(() => import("../register/confirmInfo"));

import {
  RegisterInputsType,
  RegisterResponseType,
} from "../register/types/registerTypes";

export default function SignUpForm() {
  const [step, setStep] = useState<number>(2);
  const [response, setResponse] = useState<RegisterResponseType>();

  const FormSchema = z
    .object({
      email: z
        .string()
        .min(1, "This field has to be filled.")
        .email("This is not a valid email"),
      name: z
        .string()
        .min(3, "This field must have at least 3 letters")
        .max(25, "This field must have a maximum of 25 letters"),
      password: z.string().min(6, "This field must have at least 6 letters"),
      bDay: z.string().min(1, { message: "The day field must have be valid" }),
      bYear: z.string().min(4, "The year field must have be valid"),
      bMonth: z.string().min(1, "The month field must have be valid"),
    })
    .refine(
      (data) => {
        const currentYear = new Date().getFullYear();
        const bYear = parseInt(data.bYear, 10);
        return currentYear - bYear > 8;
      },
      { path: ["bYear"], message: "You’re too young to create a account." }
    )
    .refine(
      (data) => {
        return !!data.bMonth;
      },
      { path: ["bMonth"], message: "The month field is require." }
    )
    .refine(
      (data) => {
        return !!data.bDay;
      },
      { path: ["bDay"], message: "The day field needs to be valid." }
    );

  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    watch,
    setError,
    setValue,
  } = useForm<RegisterInputsType>({ resolver: zodResolver(FormSchema) });

  const formatBirthDate = (values: RegisterInputsType) => {
    const { bDay, bMonth, bYear, email, name, password } = values;
    const birthDate = `${bDay}/${bMonth}/${bYear}`;
    return { birthDate, email, name, password };
  };

  const onSubmit: SubmitHandler<RegisterInputsType> = async (values) => {
    FormSchema.parse(values);
    const { birthDate, email, name, password } = formatBirthDate(values);
    const body = {
      username: name,
      password,
      birthDate,
      email,
    };

    const response: RegisterResponseType = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    setResponse(response);
  };

  const description = {
    0: "",
    1: "Create a password",
    2: "Tell us about yourself",
    3: "Check your information",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="formContainer">
      <h1 className="text-3xl font-montserrat font-bold self-start tracking-tighter text-left ">
        Sign up to start
        <br /> listening
      </h1>

      {step !== 0 && (
        <div className="flex flex-col gap-3">
          <span className="w-full  bg-gray-400 bg-opacity-30">
            <div
              style={{ width: `${33.33 * step}%` }}
              className="duration-500 h-[2px] bg-orange-500 rounded-full"
            />
          </span>

          <div className="self-start text-left flex gap-2 items-center">
            <span
              onClick={() => setStep(step - 1)}
              className="font-poppins text-4xl text-gray-400"
            >
              &lt;
            </span>

            <span className="flex flex-col font-kanit">
              <p className="text-gray-400">{`Step ${step} of 3`}</p>
              <p className="font-medium">{description[step as 1 | 2 | 3]}</p>
            </span>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {!step && (
          <EmailField
            key="emailField"
            setError={setError}
            error={errors.email}
            register={register}
            trigger={trigger}
            value={watch("email")}
            onNext={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <PassField
            key="passField"
            setError={setError}
            error={errors.password}
            register={register}
            trigger={trigger}
            value={watch("password")}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <PersonalInfoField
            key="personalField"
            onNext={() => setStep(3)}
            setError={setError}
            error={errors.name}
            errors={errors}
            register={register}
            trigger={trigger}
            setValue={setValue}
            value={watch("name")}
          />
        )}
        {step === 3 && (
          <ConfirmInfo
            response={response as RegisterResponseType}
            bDay={`${watch("bDay")}/${watch("bMonth")}/${watch("bYear")}`}
            email={watch("email")}
            name={watch("name")}
          />
        )}
      </AnimatePresence>
    </form>
  );
}

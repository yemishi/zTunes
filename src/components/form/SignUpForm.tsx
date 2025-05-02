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

import { RegisterInputsType } from "../register/types/registerTypes";
import { ErrorType } from "@/types/response";
import Button from "../ui/buttons/Button";
import { isValidDate } from "@/utils/helpers";

export default function SignUpForm() {
  const [step, setStep] = useState<number>(0);
  const [response, setResponse] = useState<{
    message: string;
    error: boolean;
  }>();
  const [birthDate, setBirthDate] = useState<{
    day: string;
    month: string;
    year: string;
  }>({
    day: "",
    month: "",
    year: "",
  });

  // todo: replace react-hook-forms and zod to custom useForm
  const FormSchema = z
    .object({
      email: z.string().min(1, "This field has to be filled.").email("This is not a valid email"),
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
  const description = {
    0: "",
    1: "Create a password",
    2: "Tell us about yourself",
    3: "Check your information",
  }[step];

  const onSubmit: SubmitHandler<RegisterInputsType> = async (values) => {
    const passed = await validateStep();
    if (!passed) return;

    try {
      FormSchema.parse(values);

      const { birthDate, email, name, password } = formatBirthDate(values);
      const body = {
        username: name,
        password,
        birthDate,
        email,
      };

      const response: ErrorType = await fetch("/api/user/validation", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((res) => res.json());

      setResponse(response);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };
  const validateStep = async (): Promise<boolean> => {
    if (step === 1) {
      const isEmailValid = await trigger("email");
      if (!isEmailValid) return false;

      const email = watch("email");
      const { error, message }: ErrorType = await fetch(`/api/user/validation?value=${email}&field=email`).then((res) =>
        res.json()
      );
      if (error) {
        setError("email", { message });
        return false;
      }
      setStep(2);
    }

    if (step === 2) {
      const isPasswordValid = await trigger("password");
      if (!isPasswordValid) return false;
      setStep(3);
    }

    if (step === 3) {
      const isDateValid = isValidDate(birthDate.day, birthDate.month, birthDate.year);
      if (!isDateValid) {
        setError("bDay", { message: "The day field needs to be valid." });
        return false;
      }

      setValue?.("bYear", birthDate.year);
      setValue?.("bDay", birthDate.day);
      setValue?.("bMonth", birthDate.month);

      const isFormValid = await trigger(["bDay", "bMonth", "bYear", "name"]);
      if (!isFormValid) return false;

      const username = watch("name");
      const { error, message }: ErrorType = await fetch(`/api/user/validation?value=${username}&field=username`).then(
        (res) => res.json()
      );

      if (error) {
        setError("name", { message });
        return false;
      }
      return true;
    }

    return false;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 h-full overflow-clip">
      {step !== 0 && (
        <div className="flex flex-col gap-3">
          <div className="self-start text-left flex gap-2 items-center">
            <span onClick={() => setStep(step - 1)} className="font-poppins text-4xl text-gray-400">
              &lt;
            </span>

            <span className="flex flex-col font-kanit">
              <p className="text-gray-400">{`Step ${step} of 3`}</p>
              <p className="font-medium">{description}</p>
            </span>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {step === 0 && (
          <EmailField
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
            register={register}
            error={errors.name}
            errors={errors}
            setBirthDate={setBirthDate}
            birthDate={birthDate}
          />
        )}
        {step === 3 && (
          <ConfirmInfo
            response={response as ErrorType}
            bDay={`${watch("bDay")}/${watch("bMonth")}/${watch("bYear")}`}
            email={watch("email")}
            name={watch("name")}
          />
        )}
      </AnimatePresence>

      <Button type="submit" className="text-black mt-auto mx-auto mb-7">
        Next
      </Button>
    </form>
  );
}

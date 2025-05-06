"use client";

import { FormEvent, lazy, useState } from "react";
import { AnimatePresence } from "framer-motion";

const PersonalInfoField = lazy(() => import("../register/personalInfoField"));
const ConfirmInfo = lazy(() => import("../register/confirmInfo"));
import { IoIosArrowBack } from "react-icons/io";

import { ErrorType } from "@/types/response";
import Button from "../ui/buttons/Button";
import { isValidDate } from "@/utils/helpers";
import useForm from "@/hooks/useForm";
import DivAnimated from "../ui/custom/DivAnimated";
import Input from "../ui/inputs/Input";
import ProgressStep from "../ui/custom/ProgressStep";

export default function SignUpForm() {
  const [step, setStep] = useState(0);

  const [response, setResponse] = useState<{
    message: string;
    error: boolean;
  }>();

  const fields = {
    email: { value: "", min: 1, isEmail: true, minMessage: "This field has to be filled." },
    name: {
      value: "",
      min: 3,
      max: 25,
      maxMessage: "This field must have a maximum of 25 letters",
      minMessage: "This field must have at least 3 letters",
    },
    password: { value: "", min: 6, minMessage: "This field must have at least 6 characters" },
    bDay: { value: "", min: 1, minMessage: "The day field must have be valid" },
    bYear: { value: "" },
    bMonth: { value: "" },
  };
  type FieldValues = { [K in keyof typeof fields]: (typeof fields)[K]["value"] };

  const {
    onChange,
    values: { bDay, bMonth, bYear, email, name, password },
    validateAll,
    validate,
    setError,
    setValue,
    errors,
  } = useForm<FieldValues>(fields);

  const description = {
    0: "Don’t worry, no newsletter ambushes",
    1: `Create a password for ${email || "your account"}`,
    2: "Your name & birthdate",
    3: "One last look before we go!",
  }[step];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await stepFnc();
  };

  const stepFnc = {
    0: () => validateEmail(),
    1: () => validatePass(),
    2: () => validatePersonalInfo(),
    3: () => fetchData(),
  }[step as 0 | 1 | 2 | 3];

  const validateEmail = async () => {
    if (!validate("email")) return;
    const { error, message }: ErrorType = await fetch(`/api/user/validation?value=${email}&field=email`).then((res) =>
      res.json()
    );
    if (error) return setError("email", message);
    setStep(1);
  };
  const validatePass = () => (!validate("password") ? null : setStep(2));
  const validatePersonalInfo = async () => {
    const isDateValid = isValidDate(bDay, bMonth, bYear);
    if (!isDateValid) return setError("bDay", "The day field needs to be valid.");

    if (!validate("bDay") || !validate("bMonth") || !validate("bYear") || !validate("name")) return;

    const { error, message }: ErrorType = await fetch(`/api/user/validation?value=${name}&field=username`).then((res) =>
      res.json()
    );
    if (error) return setError("name", message);
    setStep(3);
  };

  const fetchData = async () => {
    if (!validateAll()) return;
    const body = {
      username: name,
      password,
      birthDate: `${bDay}/${bMonth}/${bYear}`,
      email,
    };

    const response: ErrorType = await fetch("/api/user/validation", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());

    setResponse(response);
  };
  const nextText = {
    0: "Continue",
    1: "Create password",
    2: "Next",
    3: "Confirm and finish",
  }[step];

  const Component = {
    0: (
      <DivAnimated key="email-field" className="flex flex-col h-full gap-6 mt-5">
        <Input
          autoFocus
          value={email}
          onChange={onChange}
          name="email"
          label="Email"
          placeholder="Mohammed@gmail.com"
          error={errors?.email || ""}
        />
      </DivAnimated>
    ),
    1: (
      <DivAnimated className="flex h-full flex-col gap-6 mt-5">
        <Input
          autoFocus
          value={password}
          name="password"
          onChange={onChange}
          error={errors?.password || ""}
          label="Password"
          isPassword
          placeholder="securepass"
        />
      </DivAnimated>
    ),
    2: (
      <DivAnimated key="personalField" className="mt-5">
        <PersonalInfoField
          nameOnChange={onChange}
          nameValue={name}
          setValue={setValue}
          errors={errors}
          birthDate={{ bDay, bMonth, bYear }}
        />
      </DivAnimated>
    ),
    3: (
      <DivAnimated key="confirm-info">
        <ConfirmInfo response={response} bDay={`${bDay}/${bMonth}/${bYear}`} email={email} name={name} />
      </DivAnimated>
    ),
  }[step];

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 h-full overflow-clip">
      <ProgressStep totalSteps={3} desc={description as string} goBack={() => setStep(step - 1)} step={step} />
      <AnimatePresence mode="wait" initial={false}>
        {Component}
      </AnimatePresence>

      <Button type="submit" className="mt-auto mx-auto mb-7">
        {nextText}
      </Button>
    </form>
  );
}

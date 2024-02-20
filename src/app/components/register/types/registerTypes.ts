import {
  FieldError,
  FieldErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  email: z
    .string()
    .min(1, "This field has to be filled.")
    .email("This is not a valid email"),
  name: z
    .string()
    .min(3, "This field must have at least 3 letters")
    .max(25, "max 25 char"),
  password: z.string().min(6, "This field must have at least 6 letters"),
  bDay: z.string(),
  bYear: z.string(),
  bMonth: z.string(),
});

export type RegisterPropsType = {
  error: FieldError | undefined;
  register: UseFormRegister<RegisterInputsType>;
  trigger: UseFormTrigger<RegisterInputsType>;
  value: string;
  setError: UseFormSetError<RegisterInputsType>;
  onNext: () => void;
  errors?: FieldErrors<RegisterInputsType>;
  setValue?: UseFormSetValue<RegisterInputsType>;
};

export type RegisterInputsType = z.infer<typeof FormSchema>;

export type RegisterResponseType = {
  error: boolean;
  message?: string;
};

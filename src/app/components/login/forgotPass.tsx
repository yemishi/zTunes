import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../ui/Button";
import DivAnimated from "../ui/DivAnimated";
import Input from "../ui/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export default function ForgotPass({ close }: { close: () => void }) {
  type InputType = z.infer<typeof FormSchema>;
  const [message, setMessage] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const FormSchema = z.object({
    name: z.string().min(1, "This field is required."),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const onSubmit: SubmitHandler<InputType> = async (values) => {
    FormSchema.parse(values);
    setIsLoading(true);
    const response = await fetch(
      `/api/user/password-reset?value=${values.name}`
    ).then((res) => res.json());

    if (response.error) {
      setIsLoading(false);
      return setError("name", { message: response.message });
    }
    setIsLoading(false);
    setMessage(response.message);
  };

  return (
    <DivAnimated reverse className="flex flex-col h-[450px] gap-2">
      <h1 className="text-3xl font-montserrat font-bold self-start tracking-tighter ">
        {message ? "Email sent" : "Reset your password"}
      </h1>

      <p className="text-left pr-3 mt-3">
        {message
          ? message
          : "Enter your email address or username, and we'll send you a link to get back into your account."}
      </p>

      {message ? (
        <div className="flex flex-col gap-3 mt-7">
          <Button disabled={isLoading} onClick={close}>
            Back to login
          </Button>

          <Button
            disabled={isLoading}
            onClick={() => setMessage(null)}
            className="bg-none"
          >
            Edit email/username
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-7 h-full"
        >
          <Input
            disabled={isLoading}
            error={errors.name}
            {...register("name")}
            label="Email or Username"
            type="text"
            className="mt-11"
          />
          <Button
            disabled={isLoading}
            type="submit"
            className="mt-auto text-black"
          >
            Send link
          </Button>

          <Button
            disabled={isLoading}
            onClick={close}
            type="button"
            className="mt-auto self-center bg-transparent"
          >
            Back
          </Button>
        </form>
      )}
    </DivAnimated>
  );
}

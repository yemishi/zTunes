import Button from "@/ui/buttons/Button";
import Input from "../../../../../ui/inputs/Input";
import { FormEvent, useState } from "react";
import { ErrorType } from "@/types/response";
import useForm from "@/hooks/useForm";
import ProgressStep from "@/ui/custom/ProgressStep";

export default function RecoverPassword({ close }: { close: () => void }) {
  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    errors,
    values: { name },
    validateAll,
    onChange,
    setError,
  } = useForm<{ name: string }>({ name: { value: "", min: 1 } });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsLoading(true);
    const response: ErrorType = await fetch(`/api/user/password-reset?value=${name}`).then((res) => res.json());

    if (response.error) {
      setIsLoading(false);
      return setError("name", response.message);
    }
    setIsLoading(false);
    setMessage(response.message);
  };

  return (
    <div className="h-full flex flex-col">
      <ProgressStep
        desc={
          message ?? "Enter your email address or username, and we'll send you a link to get back into your account."
        }
        goBack={() => {}}
        step={0}
        totalSteps={0}
      />

      {message ? (
        <div className="flex flex-col gap-3 mt-7">
          <Button disabled={isLoading} onClick={close}>
            Back to login
          </Button>

          <Button disabled={isLoading} onClick={() => setMessage("")} className="bg-none">
            Edit email/username
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-7 h-full ">
          <Input
            disabled={isLoading}
            error={errors.name || ""}
            value={name}
            onChange={onChange}
            name="name"
            autoFocus
            label="Email or Username"
            className="mt-11"
          />
          <button
            onClick={close}
            type="button"
            className="underline mx-auto underline-offset-2 md:underline-offset-4 max-md:tracking-tighter text-white hover:text-amber-300 transition-all cursor-pointer"
          >
            Go Back
          </button>

          <Button disabled={isLoading} type="submit" className="text-black mt-auto mx-auto mb-7">
            Send link
          </Button>
        </form>
      )}
    </div>
  );
}

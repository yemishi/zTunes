import Input from "../ui/inputs/Input";
import { RegisterPropsType } from "./types/registerTypes";
import Button from "../ui/buttons/Button";
import DivAnimated from "../ui/DivAnimated";

export default function PassField({
  error,
  onNext,
  register,
  trigger,
}: RegisterPropsType) {
  const handleNext = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const isValid = await trigger("password");
    if (!isValid) return;
    onNext();
  };
  return (
    <DivAnimated key="passField" className="flex h-full flex-col gap-6">
      <Input
        autoFocus
        {...register("password")}
        error={error}
        label="Password"
        isPassword
        placeholder="securepass"
        className="mt-7"
      />
      <Button className="mt-auto text-black" onClick={handleNext} type="submit">
        Next
      </Button>
    </DivAnimated>
  );
}

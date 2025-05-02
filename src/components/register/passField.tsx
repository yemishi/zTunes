import Input from "../ui/inputs/Input";
import { RegisterPropsType } from "./types/registerTypes";
import Button from "../ui/buttons/Button";
import DivAnimated from "../ui/custom/DivAnimated";

export default function PassField({ error, onNext, register, trigger }: RegisterPropsType) {
  return (
    <DivAnimated  className="flex h-full flex-col gap-6">
      <Input
        autoFocus
        {...register("password")}
        error={error?.message}
        label="Password"
        isPassword
        placeholder="securepass"
        className="mt-7"
      />
    </DivAnimated>
  );
}

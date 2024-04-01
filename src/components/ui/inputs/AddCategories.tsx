import { useRef } from "react";
import Input from "./Input";
import Button from "../buttons/Button";

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  label?: string;
  placeHolder?: string;
}

export default function AddCategories({
  setCategories,
  categories,
  label,
  placeHolder,
  ...props
}: InputProps) {
  const { className, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const remove = (category: string) =>
    setCategories(categories.filter((item) => item !== category));

  const add = () => {
    if (inputRef.current && inputRef.current.value && categories.length <= 5) {
      setCategories([
        ...categories,
        inputRef.current.value.replaceAll(" ", ""),
      ]);
      inputRef.current.value = "";
    }
  };

  return (
    <div {...props} className="flex flex-col gap-4 sm:grid-cols-2">
      <div className={`flex gap-4  ${className ? className : ""}`}>
        <Input
          ref={inputRef}
          label={label || "Category"}
          placeholder={placeHolder || "Category"}
          classNameInput="bg-transparent backdrop-brightness-150 border-neutralDark-400"
        />
        <Button type="button" className="bg-transparent mt-auto" onClick={add}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => {
          return (
            <span
              className="relative py-2  px-6 rounded-lg bg-orange-600 bg-opacity-50"
              key={`${category}_${index}`}
            >
              <span>{category}</span>
              <span
                onClick={() => remove(category)}
                className="absolute top-0 right-0 size-5 bg-black cursor-pointer rounded-bl-lg rounded-tr-lg flex justify-center items-center font-mono"
              >
                x
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Input from "./Input";
import Button from "../buttons/Button";

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  label?: string;
  placeHolder?: string;
}

export default function AddCategories({ setCategories, categories, label, placeHolder, ...props }: InputProps) {
  const { className, ...rest } = props;
  const [value, setValue] = useState("");
  const remove = (category: string) => setCategories(categories.filter((item) => item !== category));

  const add = () => {
    if (categories.includes(value)) return;
    setCategories([...categories, value]);
    setValue("");
  };

  return (
    <div {...props} className="flex flex-col gap-4 sm:grid-cols-2">
      <div className={`flex gap-4  ${className ? className : ""}`}>
        <Input
          onChange={(e) => setValue(e.target.value.trim())}
          value={value}
          label={label || "Category"}
          placeholder={placeHolder || "Category"}
          className="bg-transparent backdrop-brightness-150 border-neutralDark-400 !border-black"
        />
        <Button type="button" onClick={add}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => {
          return (
            <span className="relative py-2  px-6 rounded-lg bg-white bg-opacity-50" key={`${category}_${index}`}>
              <span>{category}</span>
              <span
                onClick={() => remove(category)}
                className="absolute top-0 right-0 size-5 bg-black text-white cursor-pointer rounded-bl-lg rounded-tr-lg flex justify-center items-center font-mono"
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

import { format } from "date-fns";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectType extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string | undefined;
}

const SelectMonth = forwardRef<HTMLSelectElement, SelectType>((props, ref) => {
  const { error, ...rest } = props;

  const months = Array.from({ length: 12 }, (_, index) => format(new Date(2024, index, 1), "MMMM"));
  return (
    <select
      ref={ref}
      {...rest}
      defaultValue={rest.defaultValue || ""}
      className={`appearance-none rounded-full px-4 py-2 pr-10 border-2 border-l-1 transition-colors 
      ${error ? "border-red-400" : rest.value ? "border-blue-300" : "border-white"}
      outline-none focus:border-amber-500
    `}
    >
      <option disabled value="">
        Month
      </option>
      {months.map((value, index) => {
        return (
          <option className="bg-black-500" value={index} key={`${value}_${index}`}>
            {value}
          </option>
        );
      })}
    </select>
  );
});
export default SelectMonth;

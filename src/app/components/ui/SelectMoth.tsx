import { format } from "date-fns";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectType extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const SelectMonth = forwardRef<HTMLSelectElement, SelectType>((props, ref) => {
  const { error, ...rest } = props;

  const months = Array.from({ length: 12 }, (_, index) =>
    format(new Date(2024, index, 1), "MMMM")
  );
  return (
    <select
      ref={ref}
      {...rest}
      className={`inputForm ${error && "border-red-500"}`}
      defaultValue={rest.defaultValue || ""}
    >
      <option disabled value="">
        Month
      </option>
      {months.map((value, index) => {
        return (
          <option value={index} key={`${value}_${index}`}>
            {value}
          </option>
        );
      })}
    </select>
  );
});
export default SelectMonth;

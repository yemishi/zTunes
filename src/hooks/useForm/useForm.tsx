import { useMemo, useState } from "react";

export interface FormField {
  value: string | number | string[];
  min?: number;
  max?: number;
  maxMessage?: string;
  minMessage?: string;
  compareField?: string;
  isEmail?: boolean;
  validate?: (value: string | number) => string | null;
}

export type FormFields = Record<string, FormField>;

export default function useForm<T>(initialValues: FormFields) {
  const [fields, setFields] = useState(initialValues);
  const [errors, setErrors] = useState<Record<keyof FormFields, string | null>>({});
  const values = useMemo(() => {
    return Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value])) as {
      [K in keyof typeof fields]: (typeof fields)[K]["value"];
    } as T;
  }, [fields]);

  const setError = (field: string, msg: string | null) => setErrors((e) => ({ ...e, [field]: msg }));

  const validateField = (name: string, value: string | number | string[]): string | null => {
    const field = fields[name];
    if (!field) return null;

    const { compareField, max, min, validate, isEmail, minMessage, maxMessage } = field;
    const isNumberField = !isNaN(parseFloat(value as string));
    const len = isNumberField ? Number(value) : (value as string).length;

    if (max && len > max!)
      return maxMessage || (isNumberField ? `Must be ${max} or less` : `Must be ${max} characters or fewer`);

    if (min && len < min)
      return minMessage || (isNumberField ? `Must be at least ${min}` : `Must be at least ${min} characters long`);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (isEmail && !emailRegex.test(String(value))) return "Invalid email format.";

    if (validate && !Array.isArray(value)) return validate(value);

    if (compareField) {
      if (!fields[compareField]) throw new Error(`Field ${compareField} doesn't exist in the form schema.`);

      const fieldToCompare = fields[compareField];
      if (fieldToCompare.value !== value) return `Must be equal to ${compareField}`;
    }

    return null;
  };

  const validate = (field: string) => {
    const error = validateField(field, fields[field].value);
    setErrors({ ...errors, [field]: error });
    return !!!error;
  };

  const validateAll = () => {
    const newErrors: Record<string, string | null> = {};

    for (const name in fields) {
      const value = fields[name].value;

      const error = validateField(name, value);
      newErrors[name] = error;
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const onChange = (
    { target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    customValue?: string | number
  ) => {
    setValue(name, customValue ?? value);
  };
  const setValue = (fieldName: string, value: string | number) => {
    const field = fields[fieldName];
    if (field) {
      setFields((e) => ({ ...e, [fieldName]: { ...field, value } }));
      if (errors[fieldName]) {
        const error = validateField(fieldName, value);
        setError(fieldName, error);
      }
    }
  };

  const resetForm = () => {
    setFields(initialValues), setErrors({});
  };

  const fieldsKey = useMemo(() => Object.keys(fields), [fields]);

  return {
    fieldsKey,
    rawValues: fields,
    values,
    errors,
    onChange,
    validateAll,
    resetForm,
    setValue,
    validate,
    setError,
  };
}

import { renderHook } from "@testing-library/react";
import { act } from "react";
import useForm, { FormFields } from "./useForm";

describe("useForm", () => {
  type FormData = {
    email: string;
    password: string;
    confirmPassword: string;
  };

  const initialFields: FormFields = {
    email: {
      value: "",
      isEmail: true,
    },
    password: {
      value: "",
      min: 6,
    },
    confirmPassword: {
      value: "",
      compareField: "password",
    },
  };

  it("initializes with default values", () => {
    const { result } = renderHook(() => useForm(initialFields));
    expect(result.current.values).toEqual({
      email: "",
      password: "",
      confirmPassword: "",
    });
  });

  it("updates a field and validates it", () => {
    const { result } = renderHook(() => useForm(initialFields));

    act(() => {
      result.current.setValue("email", "invalid-email");
    });

    act(() => {
      result.current.validate("email");
    });

    expect(result.current.errors.email).toBe("Invalid email format.");
  });

  it("validates all fields and fails when values are invalid", () => {
    const { result } = renderHook(() => useForm(initialFields));

    act(() => {
      result.current.setValue("email", "bad@");
      result.current.setValue("confirmPassword", "456");
    });
    act(() => result.current.validateAll());

    expect(result.current.errors.email).toBe("Invalid email format.");
    expect(result.current.errors.password).toBe("Must be at least 6 characters long");
    expect(result.current.errors.confirmPassword).toBe("Must be equal to password");
  });

  it("passes validation when fields are valid", () => {
    const { result } = renderHook(() => useForm<FormData>(initialFields));

    act(() => {
      result.current.setValue("email", "test@example.com");
      result.current.setValue("password", "abcdef");
      result.current.setValue("confirmPassword", "abcdef");
    });

    act(() => result.current.validateAll());

    expect(result.current.errors.email).toBeNull();
    expect(result.current.errors.password).toBeNull();
    expect(result.current.errors.confirmPassword).toBeNull();
    let validate;
    act(() => {
      validate = result.current.validateAll();
    });
    expect(validate).toBe(true);
  });

  it("resets the form", () => {
    const { result } = renderHook(() => useForm<FormData>(initialFields));

    act(() => {
      result.current.setValue("email", "changed@example.com");
    });

    expect(result.current.values.email).toBe("changed@example.com");

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values.email).toBe("");
    expect(result.current.errors.email).toBeUndefined();
  });
});

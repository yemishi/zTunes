import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useForm } from "react-hook-form";
import EmailField from "./emailField";
import { RegisterInputsType } from "./types/registerTypes";
import PassField from "./passField";
import PersonalInfoField from "./personalInfoField";
import ConfirmInfo from "./confirmInfo";

const TestWrapper = ({
  component,
}: {
  component: "EmailField" | "PassField" | "PersonalInfoField";
}) => {
  const { register, trigger, setError } = useForm<RegisterInputsType>();

  const ComponentSelect = {
    EmailField,
    PassField,
    PersonalInfoField,
  }[component];

  return (
    <ComponentSelect
      error={undefined}
      register={register}
      trigger={trigger}
      value="test value"
      setError={setError}
      onNext={() => {}}
    />
  );
};

describe("EmailField component", () => {
  it("Render correctly and tests the onchange events", () => {
    const { getByRole, getByText } = render(
      <TestWrapper component="EmailField" />
    );
    const input = getByRole("textbox", { name: "email" });
    const nextStep = getByText(/next/i);
    const login = getByText(/Log in here/i);

    fireEvent.change(input, { target: { value: "test email" } });

    expect(nextStep).toBeTruthy();
    expect(login).toBeTruthy();
    expect(input).toHaveValue("test email");
  });
});

describe("PassField component", () => {
  it("Render correctly and tests the onchange events", () => {
    const { getByPlaceholderText, getByText } = render(
      <TestWrapper component="PassField" />
    );
    const input = getByPlaceholderText("securepass");
    const nextStep = getByText(/Next/i);

    fireEvent.change(input, { target: { value: "Test password" } });

    expect(input).toHaveValue("Test password");
    expect(nextStep).toBeTruthy();
  });
});

describe("PersonalInfoField component", () => {
  it("render correctly and test the onchange events", () => {
    const { getByRole, getByPlaceholderText } = render(
      <TestWrapper component="PersonalInfoField" />
    );
    const inputName = getByRole("textbox", { name: "name" });
    const inputBday = getByPlaceholderText("dd");
    const inputBdayYear = getByPlaceholderText("yyyy");

    fireEvent.change(inputName, { target: { value: "test name" } });
    fireEvent.change(inputBday, { target: { value: 17 } });
    fireEvent.change(inputBdayYear, { target: { value: 2000 } });

    expect(inputName).toHaveValue("test name");
    expect(inputBday).toHaveValue(17);
    expect(inputBdayYear).toHaveValue(2000);
  });
});

describe("ConformInfo component", () => {
  it("Render correctly ", () => {
    const { getByPlaceholderText, getByText } = render(
      <ConfirmInfo
        bDay="01/01/2000"
        email="emailTest@gmail.com"
        name="testName"
      />
    );
    const [day, month, year] = "01/01/2000".split("/");
    const name = getByText(/testName/i);
    const email = getByText(/emailTest@gmail.com/i);
    const next = getByText(/Everything is right!/i);

    expect(day).toBeTruthy();
    expect(month).toBeTruthy();
    expect(year).toBeTruthy();
    expect(name).toBeTruthy();
    expect(email).toBeTruthy();
    expect(next).toBeTruthy();
  });
});

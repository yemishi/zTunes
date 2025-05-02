import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import LoginForm from "../form/SignInForm";
import ForgotPass from "./forgotPass";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: () => null,
    };
  },
}));

/* global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock; */

describe("Login component", () => {
  it("render correctly and tests the onchange events", () => {
    const { getByRole, getByPlaceholderText, getByText } = render(
      <LoginForm close={() => {}} />
    );

    const inputName = getByRole("textbox", { name: /name/i });
    const inputPass = getByPlaceholderText(/password/i);

    const buttonSubmit = getByText("Log in");
    const buttonForgotPass = getByText("Forgot your password?");

    fireEvent.change(inputName, { target: { value: "name test" } });
    fireEvent.change(inputPass, { target: { value: "123123" } });

    expect(inputName).toHaveValue("name test");
    expect(inputPass).toHaveValue("123123");

    expect(buttonSubmit).toBeTruthy();
    expect(buttonForgotPass).toBeTruthy();
  });
});

describe("ForgotPass component", () => {
  it("render correctly and test the onchange event", () => {
    const { getByRole, getByText } = render(<ForgotPass close={() => {}} />);
    const inputName = getByRole("textbox", { name: /name/i });

    const back = getByText("Back");
    const submit = getByText("Send link");

    fireEvent.change(inputName, { target: { value: "name test" } });

    expect(inputName).toHaveValue("name test");
    expect(back).toBeTruthy();
    expect(submit).toBeTruthy();
  });
});

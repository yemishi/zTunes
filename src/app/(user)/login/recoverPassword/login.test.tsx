import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import ForgotPass from "./RecoverPassword";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: () => null,
    };
  },
}));

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

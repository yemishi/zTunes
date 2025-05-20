import { render, screen } from "@testing-library/react";
import ErrorWrapper from "./ErrorWrapper";
import "@testing-library/jest-dom";

describe("ErrorWrapper", () => {
  it("renders the error message when error is true", () => {
    render(<ErrorWrapper error={true} message="Something blew up." />);
    expect(screen.getByText("Something blew up.")).toBeInTheDocument();
  });

  it("renders the default message if no message is provided", () => {
    render(<ErrorWrapper error={true} />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("renders children when error is false", () => {
    render(
      <ErrorWrapper error={false}>
        <div>Content is fine</div>
      </ErrorWrapper>
    );
    expect(screen.getByText("Content is fine")).toBeInTheDocument();
  });

  it("applies custom className and hover class if refetch is provided", () => {
    const { container } = render(<ErrorWrapper error={true} refetch={() => {}} className="bg-red-500" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("bg-red-500");
    expect(wrapper).toHaveClass("cursor-pointer");
  });
});

import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react";
import PopConfirm from "./PopConfirm";

jest.mock("../Modal", () => ({ children, onClose }: any) => (
  <div data-testid="mock-modal" onClick={onClose}>
    {children}
  </div>
));
jest.mock("@/ui/buttons/Button", () => ({ children, onClick, ...props }: any) => (
  <button onClick={onClick} {...props}>
    {children}
  </button>
));

describe("PopConfirm", () => {
  const mockConfirm = jest.fn();
  const mockClose = jest.fn();

  beforeEach(() => {
    mockConfirm.mockClear();
    mockClose.mockClear();
  });

  it("renders default confirmation message with name", () => {
    render(<PopConfirm confirm={mockConfirm} onClose={mockClose} name="my cat video" />);
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
    expect(screen.getByText(/my cat video/)).toBeInTheDocument();
    expect(screen.getByText(/This action is permanent/i)).toBeInTheDocument();
  });

  it("renders custom description if provided", () => {
    render(<PopConfirm confirm={mockConfirm} onClose={mockClose} desc="Custom destruction awaits." />);
    expect(screen.getByText("Custom destruction awaits.")).toBeInTheDocument();
    expect(screen.queryByText(/This action is permanent/)).not.toBeInTheDocument();
  });

  it("calls onClose when cancel is clicked", () => {
    render(<PopConfirm confirm={mockConfirm} onClose={mockClose} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls confirm when confirm button is clicked", () => {
    render(<PopConfirm confirm={mockConfirm} onClose={mockClose} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(mockConfirm).toHaveBeenCalled();
  });

  it("shows loading state when isLoading is true", () => {
    render(<PopConfirm confirm={mockConfirm} onClose={mockClose} isLoading={true} />);
    expect(screen.getByText("Deleting...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Deleting.../i })).toBeDisabled();
  });

  it("renders custom confirm description if provided", () => {
    render(<PopConfirm confirm={mockConfirm} onClose={mockClose} confirmDesc="Wipe It" />);
    expect(screen.getByText("Wipe It")).toBeInTheDocument();
  });
});

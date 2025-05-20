import "@testing-library/jest-dom"
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Modal from "./Modal";

beforeEach(() => {
  const modalRoot = document.createElement("div");
  modalRoot.setAttribute("id", "modal");
  document.body.appendChild(modalRoot);
});

afterEach(() => {
  cleanup();
  const modalRoot = document.getElementById("modal");
  if (modalRoot) {
    modalRoot.remove();
  }
});

test("renders children inside modal", () => {
  render(
    <Modal onClose={jest.fn()}>
      <p>Modal Content</p>
    </Modal>
  );
  expect(screen.getByText("Modal Content")).toBeInTheDocument();
});

test("calls onClose when backdrop is clicked", () => {
  const onClose = jest.fn();
  render(
    <Modal onClose={onClose}>
      <div>Inner Content</div>
    </Modal>
  );

  const backdrop = screen.getByText("Inner Content").parentElement?.parentElement!;
  fireEvent.click(backdrop);

  expect(onClose).toHaveBeenCalled();
});

test("does not call onClose when modal content is clicked", () => {
  const onClose = jest.fn();
  render(
    <Modal onClose={onClose}>
      <div data-testid="modal-content">Click Me</div>
    </Modal>
  );

  fireEvent.click(screen.getByTestId("modal-content"));
  expect(onClose).not.toHaveBeenCalled();
});

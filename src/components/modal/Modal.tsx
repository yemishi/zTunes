"use client";

import { HTMLAttributes, MouseEvent, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose, ...props }: Props) => {
  const { className, ...rest } = props;

  const modalRoot = document.getElementById("modal");
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) onClose();
  };

  if (!modalRoot) return <div className="bg-red-500">Modal not found.</div>;
  return createPortal(
    <div className="flex w-screen h-screen bg-black/60 z-50 top-0 left-0 fixed" onClick={handleBackdropClick}>
      <div {...rest} className={className}>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;

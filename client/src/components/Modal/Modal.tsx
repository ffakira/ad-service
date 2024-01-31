"use client";

import useOutsideRef from "@/hooks/useOutsideRef";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export enum ModalOptions {
  GENERATE_REDEEM_CODE,
  EDIT_REDEEM_CODE,
  DELETE_NFT_CONFIRMATION,
}

interface ModalBaseProps {
  children: React.ReactNode;
  handleClose: () => void;
  isOpen?: boolean | undefined | ModalOptions;
}

function ModalBase({ children, handleClose }: ModalBaseProps): React.ReactNode {
  const modalRef = useRef<HTMLDivElement>(null);
  const [handleOutside] = useOutsideRef(modalRef);

  useEffect(() => {
    if (handleOutside) handleClose();

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [handleOutside]);

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 h-full w-screen bg-black/80 z-50">
      <div
        ref={modalRef}
        className="relative bg-white mt-4 lg:mt-0 rounded-xl shadow-[8px_8px_0_0_rgba(0,0,0,0.3)] h-auto w-11/12 md:w-[600px]"
      >
        <div
          onClick={() => handleClose()}
          role="button"
          aria-description="Close modal"
          className="absolute -top-3 -right-3 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-full h-[40px] w-[40px] flex justify-center items-center font-bold"
        >
          X
        </div>
        {children}
      </div>
    </div>
  );
}

interface ModalProps {
  children: React.ReactNode;
  handleClose: () => void;
  isOpen?: boolean | undefined;
}

export default function Modal({
  children,
  handleClose,
  isOpen,
}: ModalProps): React.ReactNode {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return mounted
    ? createPortal(
        <ModalBase handleClose={() => handleClose()}>{children}</ModalBase>,
        document.body
      )
    : null;
}

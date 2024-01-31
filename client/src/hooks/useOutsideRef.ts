"use client";

import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  RefObject,
} from "react";

type IBooleanState = [boolean, Dispatch<SetStateAction<boolean>>];

/**
 * @dev handy hook to check if the div element is clicked outside
 */
export default function useOutsideRef<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>
): IBooleanState {
  const [handleOutside, setHandleOutside] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setHandleOutside(true);
      } else {
        setHandleOutside(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return [handleOutside, setHandleOutside];
}

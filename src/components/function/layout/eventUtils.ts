import { useEffect } from "react";

export const dispatchWidthEvent = (width: number) => {
  const event = new CustomEvent<number>("menuWidthChange", { detail: width });
  window.dispatchEvent(event);
};

export const useWidthEventListener = (callback: (width: number) => void) => {
  useEffect(() => {
    const handleWidthChange = (event: Event) => {
      const customEvent = event as CustomEvent<number>;
      callback(customEvent.detail);
    };

    window.addEventListener("menuWidthChange", handleWidthChange);

    return () =>
      window.removeEventListener("menuWidthChange", handleWidthChange);
  }, [callback]);
};

import { useEffect, useState } from "react";
import { useWidthEventListener } from "./eventUtils";

export default function MainPage({ children }: { children: React.ReactNode }) {
  const [menuWidth, setMenuWidth] = useState(0);
  const [marginLeft, setMarginLeft] = useState("0px");

  useWidthEventListener((newWidth: number) => {
    setMenuWidth(newWidth);
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const calculateMarginLeft = () => {
        if (window.innerWidth >= 1024) {
          // Calculate the margin as a percentage of viewport width
          const marginVw = 0.01 * menuWidth * 25;
          setMarginLeft(`${marginVw}vw`);
        } else {
          setMarginLeft("0px");
        }
      };

      calculateMarginLeft();
      window.addEventListener("resize", calculateMarginLeft);

      return () => {
        window.removeEventListener("resize", calculateMarginLeft);
      };
    }
  }, [menuWidth]);

  return (
    <div
      className="flex-grow bg-background transition-[margin-left] duration-250 overflow-y-auto"
      style={{ 
        marginLeft,
        height: "calc(100vh - var(--header-height))"
      }}
    >
      {children}
    </div>
  );
}

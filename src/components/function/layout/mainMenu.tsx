import { Button } from "~/components/function/input/button";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/function/utility/resizable";

import { dispatchWidthEvent } from "./eventUtils";
import { ImperativePanelHandle } from "react-resizable-panels";

export default function MainMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState("auto");
  const dropdownRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<ImperativePanelHandle>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const updateMaxHeight = useCallback(() => {
    if (panelRef.current) {
      const header = document.querySelector("header");
      const viewportHeight = window.innerHeight;
      const headerRect = header?.getBoundingClientRect();
      if (!headerRect) {
        setMaxHeight("0px");
      } else {
        const availableHeight = viewportHeight - headerRect.bottom;
        setMaxHeight(`${availableHeight}px`);
      }
    }
  }, []);

  const handleResize = useCallback(() => {
    if (panelRef.current) {
      const width = panelRef.current.getSize();
      dispatchWidthEvent(isOpen ? width : 0);
    }
  }, [isOpen]);

  useEffect(() => {
    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);
    return () => window.removeEventListener("resize", updateMaxHeight);
  }, [updateMaxHeight]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, handleResize]);

  const variants = {
    open: {
      height: maxHeight,
      transition: {
        duration: 0.5,
        stiffness: 100,
      },
    },
    closed: {
      height: 0,
      transition: {
        duration: 0.5,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button onClick={toggleOpen} variant="clear">
        <Menu />
      </Button>
      <div className="absolute w-[50vw] md:w-[25vw] -left-2 p-0 pointer-events-none mt-1">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={50}
            minSize={25}
            autoSave="persistence"
            ref={panelRef}
            onResize={handleResize}
          >
            <motion.div
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              variants={variants}
              className="pointer-events-auto flex flex-col overflow-hidden justify-between bg-gradient-to-b from-header to-background"
            >
              <div className="px-2 py-1"></div>
              <h2 className="px-2 py-1 text-foreground-dull whitespace-nowrap overflow-hidden w-full fade-right">
                © 2024{" "}
                <Link to="/" className="hover:underline">
                  v.gallery
                </Link>
              </h2>
            </motion.div>
          </ResizablePanel>
          <ResizableHandle className="pointer-events-auto" />
          <ResizablePanel className="pointer-events-none" defaultSize={50} />
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

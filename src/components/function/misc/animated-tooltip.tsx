import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/function/misc/avatar";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

// SOURCED FROM https://ui.aceternity.com/components/animated-tooltip

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <>
      {items.map((item, idx) => (
        <div
          className="-mr-4  relative group"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs  flex-col items-center justify-center rounded-md bg-card z-50 shadow-xl px-4 py-2"
              >
                <div className="font-bold text-card-foreground relative z-30 text-base">
                  {item.name}
                </div>
                <div className="text-card-foreground text-xs">
                  {item.designation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>{" "}
          {/*Avatar is different from documentation */}
          <Avatar
            onMouseMove={handleMouseMove}
            className="h-14 w-14 relative transition duration-500"
          >
            <AvatarImage src={item.image} alt={item.name} />
            <AvatarFallback>O</AvatarFallback>
          </Avatar>
        </div>
      ))}
    </>
  );
};

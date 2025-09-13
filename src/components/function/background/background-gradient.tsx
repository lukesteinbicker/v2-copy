import { cn } from "~/utils/tailwind-merge";
import React from "react";
import { motion } from "framer-motion";

// SOURCED FROM https://ui.aceternity.com/components/background-gradient

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 group-hover:rounded-none",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#9cb0ca,transparent),radial-gradient(circle_farthest-side_at_100%_0,#5c7c9c,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#8cc5e7,transparent),radial-gradient(circle_farthest-side_at_0_0,#33444f,#34393c)]",
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] group-hover:rounded-none",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#9cb0ca,transparent),radial-gradient(circle_farthest-side_at_100%_0,#5c7c9c,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#8cc5e7,transparent),radial-gradient(circle_farthest-side_at_0_0,#33444f,#34393c)]",
        )}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};

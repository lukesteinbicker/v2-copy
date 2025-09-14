import { Link as TanStackLink, type LinkProps as TanStackLinkProps } from "@tanstack/react-router";
import React from "react";
import { cn } from "~/components/function/data-table/components/src/lib/utils";
import { ArrowUpRight } from "lucide-react";

export interface LinkProps extends Omit<TanStackLinkProps, 'to'> {
  className?: string;
  children?: React.ReactNode;
  hideArrow?: boolean;
  href?: string;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, children, hideArrow, ...props }, ref) => {
    const isInternal =
      href?.toString().startsWith("/") || href?.toString().startsWith("#");
    const externalLinkProps = !isInternal
      ? { target: "_blank", rel: "noreferrer" }
      : undefined;

    // Convert href to to prop for TanStack Router
    const to = href as string;

    return (
      <TanStackLink
        className={cn(
          "group text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground",
          "ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md",
          className
        )}
        ref={ref}
        to={to}
        {...externalLinkProps}
        {...props}
      >
        {children}
        {!isInternal && !hideArrow ? (
          <ArrowUpRight className="text-muted-foreground w-4 h-4 inline-block ml-0.5 group-hover:text-foreground group-hover:-translate-y-px group-hover:translate-x-px" />
        ) : null}
      </TanStackLink>
    );
  }
);

Link.displayName = "Link";

export { Link };

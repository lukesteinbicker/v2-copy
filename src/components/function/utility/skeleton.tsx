import { cn } from "~/utils/tailwind-merge";
// SOURCED FROM https://ui.shadcn.com/docs/components/skeleton

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

export { Skeleton };

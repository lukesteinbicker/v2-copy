import React from "react";
import { NuqsAdapter } from "nuqs/adapters/react";

interface NuqsAdapterWrapperProps {
  children: React.ReactNode;
}

export function NuqsAdapterWrapper({
  children,
}: NuqsAdapterWrapperProps) {
  return (
    <NuqsAdapter>
      {children}
    </NuqsAdapter>
  );
} 
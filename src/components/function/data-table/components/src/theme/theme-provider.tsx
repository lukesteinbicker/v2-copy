"use client";

import * as React from "react";

export interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: "light" | "dark" | "system";
  defaultTheme?: "light" | "dark" | "system";
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ 
  children, 
  theme = "dark",
  defaultTheme = "dark",
  storageKey = "theme",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props 
}: ThemeProviderProps) {
  // Simple theme provider for TanStack Start
  // You can implement your own theme logic here or use a different theme library
  return (
    <div data-theme={theme} className={theme} {...props}>
      {children}
    </div>
  );
}

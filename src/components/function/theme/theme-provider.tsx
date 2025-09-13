import { setTheme } from "~/lib/theme/root";
import { useRouter } from "@tanstack/react-router";
import { createContext, PropsWithChildren, use } from "react";

export type Theme = "light" | "dark";

type ThemeContextVal = { theme: Theme; setTheme: (val: Theme) => void };
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextVal | null>(null);

export function ThemeProvider({ children, theme }: Props) {
  const router = useRouter();
  
  function setThemeFunction(val: Theme) {
    setTheme({ data: val });
    router.invalidate();
  }
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeFunction }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const val = use(ThemeContext);
  if (!val) throw new Error("useTheme called outside of ThemeProvider!");
  return val;
}

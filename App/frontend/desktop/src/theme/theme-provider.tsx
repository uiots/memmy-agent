/** Theme provider module. */
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { Theme } from "@memmy/local-api-contracts";

/** Type definition for resolved theme. */
export type ResolvedTheme = "light" | "dark";

/** Contract for theme context value. */
export interface ThemeContextValue {
  theme: Theme | string | undefined;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Handles resolve theme preference. */
export function resolveThemePreference(theme: Theme | string | undefined, systemPrefersDark?: boolean): ResolvedTheme {
  if (theme === "dark") {
    return "dark";
  }
  if (theme === "light") {
    return "light";
  }
  // "system" (the default) and any unknown value follow the OS color scheme.
  return systemPrefersDark ? "dark" : "light";
}

const darkModeQuery = typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;

/** Handles subscribe system dark. */
function subscribeSystemDark(onStoreChange: () => void): () => void {
  darkModeQuery?.addEventListener("change", onStoreChange);
  return () => {
    darkModeQuery?.removeEventListener("change", onStoreChange);
  };
}

/** Handles get system dark snapshot. */
function getSystemDarkSnapshot(): boolean {
  return darkModeQuery?.matches ?? false;
}

/** Handles use system prefers dark. */
function useSystemPrefersDark(): boolean {
  return useSyncExternalStore(subscribeSystemDark, getSystemDarkSnapshot, () => false);
}

/** Handles theme provider. */
export function ThemeProvider(props: { theme: Theme | string | undefined; children: ReactNode }) {
  const systemPrefersDark = useSystemPrefersDark();
  const resolvedTheme = useMemo(() => resolveThemePreference(props.theme, systemPrefersDark), [props.theme, systemPrefersDark]);
  const value = useMemo(() => ({ theme: props.theme, resolvedTheme }), [props.theme, resolvedTheme]);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>;
}

/** Handles use theme context. */
export function useThemeContext(): ThemeContextValue {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }

  return value;
}

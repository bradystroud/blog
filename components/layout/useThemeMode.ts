import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

/**
 * Reflects the current site theme by watching the `dark` class on <html>,
 * which the header ThemeToggle (and the no-flash init script) set. Updates
 * live when the theme changes so consumers like Giscus can re-sync.
 */
export function useThemeMode(): ThemeMode {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const el = document.documentElement;
    const read = () => setMode(el.classList.contains("dark") ? "dark" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return mode;
}

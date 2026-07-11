import React, { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

/**
 * Toggles the `dark` class on <html> and persists the choice to localStorage.
 * The initial class is set before paint by the inline script in _document.tsx,
 * so this component only reflects and updates it — it never owns the source of
 * truth, which avoids a flash of the wrong theme on load.
 */
export const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* private mode / storage disabled — ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rule text-ink-mute hover:text-accent hover:border-rule-strong motion-safe:transition-colors"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
      aria-pressed={mounted ? isDark : undefined}
    >
      {/* Icon is only rendered after mount to keep SSR/client markup identical. */}
      <span aria-hidden="true" suppressHydrationWarning>
        {mounted ? (isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />) : null}
      </span>
    </button>
  );
};

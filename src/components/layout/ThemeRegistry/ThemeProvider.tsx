"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ripple, setRipple] = useState({ x: 0, y: 0, active: false, targetTheme: "light" as Theme });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = (e: React.MouseEvent) => {
    const rect = document.documentElement.getBoundingClientRect();
    const newTheme = theme === "light" ? "dark" : "light";
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
      targetTheme: newTheme,
    });
    // Delay the actual theme change until ripple animation completes
    setTimeout(() => {
      setTheme(newTheme);
    }, 300);
  };

  useEffect(() => {
    if (ripple.active) {
      const timer = setTimeout(() => setRipple((r) => ({ ...r, active: false })), 300);
      return () => clearTimeout(timer);
    }
  }, [ripple.active]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {mounted ? children : <div style={{ visibility: "hidden" }} />}
      {ripple.active && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: ripple.y,
              left: ripple.x,
              width: Math.max(window.innerWidth, window.innerHeight) * 2,
              height: Math.max(window.innerWidth, window.innerHeight) * 2,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: theme === "dark"
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(0, 0, 0, 0.3)",
              animation: "ripple-expand 0.3s ease-out forwards",
            }}
          />
          <style>{`
            @keyframes ripple-expand {
              0% {
                transform: translate(-50%, -50%) scale(0);
              }
              100% {
                transform: translate(-50%, -50%) scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </ThemeContext.Provider>
  );
}
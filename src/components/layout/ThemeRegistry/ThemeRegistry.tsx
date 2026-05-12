"use client";

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";
import { ThemeProvider, useTheme } from "./ThemeProvider";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      light: "#64b5f6",
      dark: "#1565c0",
    },
    background: {
      default: "#ffffff",
      paper: "#faf8f5",
    },
    text: {
      secondary: "#202020",
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    allVariants: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
      light: "#e3f2fd",
      dark: "#42a5f5",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      secondary: "#d4d3d3",
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    allVariants: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
  },
});

function ThemedApp({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ThemedApp>{children}</ThemedApp>
    </ThemeProvider>
  );
}
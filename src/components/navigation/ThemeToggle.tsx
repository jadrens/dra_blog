"use client";

import { IconButton } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { useTheme } from "../layout/ThemeRegistry/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      sx={{
        transition: "transform 0.3s ease-in-out, rotate 0.3s ease-in-out",
        "&:hover": {
          transform: "rotate(15deg) scale(1.1)",
          backgroundColor: "action.hover",
        },
      }}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <WbSunnyIcon sx={{ color: "#fbbf24", transition: "color 0.3s" }} />
      ) : (
        <NightsStayIcon sx={{ color: "#6366f1", transition: "color 0.3s" }} />
      )}
    </IconButton>
  );
}
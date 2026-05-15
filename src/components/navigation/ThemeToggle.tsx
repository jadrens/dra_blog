"use client";

import { IconButton } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { motion, AnimatePresence } from "framer-motion";
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
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <WbSunnyIcon sx={{ color: "#fbbf24" }} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <NightsStayIcon sx={{ color: "#6366f1" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </IconButton>
  );
}
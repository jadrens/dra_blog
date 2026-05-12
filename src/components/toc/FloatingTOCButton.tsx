"use client";

import { Fab } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface FloatingTOCButtonProps {
  onClick: () => void;
}

export default function FloatingTOCButton({ onClick }: FloatingTOCButtonProps) {
  return (
    <Fab
      onClick={onClick}
      aria-label="Table of contents"
      sx={{
        position: "fixed",
        bottom: 80,
        right: 24,
        zIndex: 1300,
        display: { xs: "flex", sm: "none" },
      }}
    >
      <MenuIcon />
    </Fab>
  );
}
"use client";

import Navbar from "@/components/layout/Navbar";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Box component="main" className="flex-1 mx-auto w-full max-w-3xl px-4 py-8">
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          {t.about.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t.about.description}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <MuiLink
            href={`mailto:${t.about.email}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "inherit",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <EmailIcon fontSize="small" />
            {t.about.email}
          </MuiLink>
          <MuiLink
            href="https://github.com/jadrens"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "inherit",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <GitHubIcon fontSize="small" />
            {t.about.github}
          </MuiLink>
        </Box>
      </Box>
    </div>
  );
}
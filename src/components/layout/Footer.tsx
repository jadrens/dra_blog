"use client";

import { Box, Typography, Chip, Avatar } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useI18n } from "@/lib/i18n";
import BouncingAvatar from "./BouncingAvatar";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <>
      <Box
        component="footer"
        sx={{
          mt: "auto",
          py: 3,
          px: { xs: 4, sm: 3 },
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Avatar
          src="/avatar.png"
          alt="dragonren"
          className="footer-avatar"
          sx={{ width: 40, height: 40, transition: "transform 0.2s", "&:hover": { transform: "scale(1.2)" } }}
        />
        <Typography variant="body2" color="text.secondary">
          &copy; {year} dragonren
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
          <Chip
            icon={<EmailIcon sx={{ fontSize: 14 }} />}
            label={t.about.email}
            component="a"
            href={`mailto:${t.about.email}`}
            clickable
            size="small"
            variant="outlined"
            sx={{ p: 1.5 }}
          />
          {/* <Chip
            icon={<LinkIcon sx={{ fontSize: 14 }} />}
            label={t.footer.beian}
            component="a"
            href="https://beian.miit.gov.cn/"
            clickable
            size="small"
            variant="outlined"
            target="_blank"
            rel="noopener"
            sx={{ p: 1.5 }}
          /> */}
          <Chip
            icon={<GitHubIcon sx={{ fontSize: 14 }} />}
            label="GitHub"
            component="a"
            href="https://github.com/jadrens/drablog"
            clickable
            size="small"
            variant="outlined"
            target="_blank"
            rel="noopener"
            sx={{ p: 1.5 }}
          />
        </Box>
      </Box>
    </Box>
    <BouncingAvatar />
    </>
  );
}

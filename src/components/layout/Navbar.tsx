"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ThemeToggle from "../navigation/ThemeToggle";
import LocaleSwitcher from "../navigation/LocaleSwitcher";
import { useI18n } from "@/lib/i18n";
import { alpha } from "@mui/material";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useI18n();


  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          backgroundColor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
          <Box sx={{ flexGrow: 1 }}>
            <Avatar
              component={Link}
              href="/"
              src="/avatar.png"
              alt="dragonren"
              sx={{ width: 32, height: 32 }}
            />
          </Box>

          {isMobile ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ThemeToggle />
              <LocaleSwitcher />
              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <ThemeToggle />
              <LocaleSwitcher />
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  size="small"
                >
                  {t.nav[item.key as keyof typeof t.nav]}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: 280, px: 2 } }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t.nav.menu}
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={t.nav[item.key as keyof typeof t.nav]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

const navItems = [
  { key: "home", href: "/" },
  { key: "posts", href: "/blog" },
  { key: "about", href: "/about" },
] as const;
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  TextField,
  InputAdornment,
  Paper,
  List as MuiList,
  Chip,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ThemeToggle from "../navigation/ThemeToggle";
import LocaleSwitcher from "../navigation/LocaleSwitcher";
import { useI18n } from "@/lib/i18n";
import { alpha } from "@mui/material";

interface SearchResult {
  slug: string;
  title: string;
  date: string;
  tags: string[];
}

interface SearchResponse {
  results: SearchResult[];
  tags: string[];
}

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t, locale } = useI18n();

  const navItems = [
    { key: "home", href: "/" },
    { key: "posts", href: `/blog/${locale}` },
    { key: "about", href: "/about" },
  ] as const;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchFocused(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        if (searchFocused) {
          inputRef.current?.blur();
        }
        setSearchFocused(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`);
        const data: SearchResponse = await res.json();
        setSearchResults(data.results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, locale]);

  const handleResultClick = (slug: string) => {
    router.push(`/blog/${locale}/${slug}`);
    setSearchQuery("");
    setSearchResults([]);
    setSearchFocused(false);
  };

  const showResults = searchFocused && (searchQuery.trim().length > 0 || searchResults.length > 0);


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
        <Toolbar sx={{ px: { xs: 2, sm: 4 }, display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
          <Avatar
            component={Link}
            href="/"
            src="/avatar.png"
            alt="dragonren"
            sx={{ width: 32, height: 32, flexShrink: 0 ,flexGrow: 0}}
          />

          {isMobile ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={() => setSearchFocused(true)} aria-label="Search">
                <SearchIcon />
              </IconButton>
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
            <Box sx={{ display: "flex", gap: 1, alignItems: "center",flexDirection: "row-reverse", flexGrow: 1 }}>
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


              <LocaleSwitcher />
              <ThemeToggle />



              <Box ref={searchRef} sx={{ position: "relative", flexShrink: 0, flexGrow: 1, display: "flex", alignItems: "center",justifyContent: "flex-end", zIndex: 3 }}>
                <TextField
                  inputRef={inputRef}
                  size="small"
                  placeholder={t.search.placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="caption" sx={{ color: "text.disabled", px: 0.5, py: 0.25, border: 1, borderColor: "divider", borderRadius: 0.5 }}>
                            {searchFocused ? "Esc" : "⌘K"}
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    width: searchFocused ? "calc(100% - 32px)" : 160,
                    transition: "width 0.25s ease, background-color 0.2s ease",
                    px: { xs: 0.5, sm: 1 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: alpha(theme.palette.action.hover, 0.04),
                      "&:hover": { bgcolor: alpha(theme.palette.action.hover, 0.08) },
                      "&.Mui-focused": { bgcolor: alpha(theme.palette.action.hover, 0.08) },
                    },
                  }}
                />
                {showResults && (
                  <Paper
                    elevation={8}
                    sx={{
                      position: "absolute",
                      top: "100%",
                      mt: 0.5,
                      left: 0,
                      right: 0,
                      maxHeight: 400,
                      overflow: "auto",
                      zIndex: theme.zIndex.tooltip,
                      borderRadius: 1.5,
                    }}
                  >
                    {searchLoading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                        <CircularProgress size={20} />
                      </Box>
                    ) : searchResults.length === 0 ? (
                      <Typography color="text.secondary" sx={{ textAlign: "center", py: 2, fontSize: "0.875rem" }}>
                        {t.search.noResults}
                      </Typography>
                    ) : (
                      <MuiList  dense>
                        {searchResults.map((result) => (
                          <ListItem sx={{ cursor: "pointer" }} key={result.slug} disablePadding>
                            <ListItemButton onClick={() => handleResultClick(result.slug)} sx={{ py: 1 }}>
                              <ListItemText
                                primary={result.title}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </MuiList>
                    )}
                  </Paper>
                )}
              </Box>
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
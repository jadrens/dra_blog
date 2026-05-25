"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Box, List, ListItem, ListItemButton, ListItemText, Collapse, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useReadingProgress, Heading } from "../reading/ReadingProgressContext";
import { useI18n } from "@/lib/i18n";

const NAV_HEIGHT = 64;
const ITEM_HEIGHT = 32; // estimated height per item

interface TocItemProps {
  heading: Heading;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}

const INDENT_PER_LEVEL = 1.5;

function TocItem({ heading, expandedIds, onToggle }: TocItemProps) {
  const { activeHeadingId } = useReadingProgress();
  const hasChildren = heading.children.length > 0;
  const isActive = activeHeadingId === heading.id;
  const isExpanded = expandedIds.has(heading.id);

  const isDescendantActive = (h: Heading): boolean => {
    if (h.id === activeHeadingId) return true;
    return h.children.some(isDescendantActive);
  };

  const isActiveOrAncestor = isActive || (hasChildren && heading.children.some(isDescendantActive));

  const handleClick = () => {
    if (hasChildren) {
      onToggle(heading.id);
    }
    const element = document.getElementById(heading.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${heading.id}`);
    }
  };

  const indent = (heading.level - 1) * INDENT_PER_LEVEL;

  return (
    <>
      <ListItem disablePadding disableGutters>
        <ListItemButton
          onClick={handleClick}
          sx={{
            py: 0.5,
            pl: 0.5 + indent,
            borderRadius: 1,
            bgcolor: isActive ? "action.selected" : "transparent",
            "&:hover": { bgcolor: isActive ? "action.selected" : "action.hover" },
            minHeight: ITEM_HEIGHT,
          }}
        >
          {hasChildren && (
            <Box sx={{ mr: 0.5, display: "flex", alignItems: "center" }}>
              {isExpanded ? (
                <ExpandLessIcon sx={{ fontSize: 18 }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: 18 }} />
              )}
            </Box>
          )}
          <ListItemText
            primary={
              <Typography
                variant={heading.level === 1 ? "body2" : "caption"}
                noWrap
                sx={{ fontWeight: heading.level === 1 ? 600 : 400, color: isActive ? "primary.main" : "text.primary" }}
              >
                {heading.text}
              </Typography>
            }
          />
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List disablePadding>
            {heading.children.map((child) => (
              <TocItem key={child.id} heading={child} expandedIds={expandedIds} onToggle={onToggle} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default function TableOfContents() {
  const { headings } = useReadingProgress();
  const { t } = useI18n();
  const [navVisible, setNavVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= NAV_HEIGHT) {
        setNavVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setNavVisible(false);
      } else {
        setNavVisible(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-expand: greedily expand from top until overflow
  useEffect(() => {
    if (headings.length === 0) return;

    const maxHeight = navVisible ? window.innerHeight - 100 : window.innerHeight - 32;
    const availableItems = Math.floor(maxHeight / ITEM_HEIGHT);

    const tryExpanded = new Set<string>();
    let itemCount = 0;

    const tryAdd = (hs: Heading[]): boolean => {
      for (const h of hs) {
        if (itemCount >= availableItems) return false;
        tryExpanded.add(h.id);
        itemCount++;
        if (h.children.length > 0) {
          for (const c of h.children) {
            if (itemCount >= availableItems) break;
            tryExpanded.add(c.id);
            itemCount++;
          }
        }
      }
      return true;
    };

    tryAdd(headings);
    setExpandedIds(tryExpanded);
  }, [headings, navVisible]);

  const handleToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  if (headings.length === 0) return null;

  return (
    <Box
      ref={listRef}
      sx={{
        width: 250,
        flexShrink: 0,
        position: "sticky",
        top: navVisible ? 64 : 0,
        maxHeight: navVisible ? "calc(100vh - 64px)" : "calc(100vh)",
        overflowY: "auto",
        pl: 2,
        pr: 2,
        pt: 1,
        pb: 2,
        mr: 1,
        zIndex: 1,
        borderRight: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        borderRadius: 1,
        display: { xs: "none", sm: "block" },
        transform: loaded ? "translateX(0)" : "translateX(-20px)",
        opacity: loaded ? 1 : 0,
        transition: "top 0.2s, max-height 0.2s, padding-top 0.2s, transform 0.3s ease-out, opacity 0.3s ease-out",
      }}
    >
      <Typography
        variant="overline"
        sx={{ px: 1, color: "text.secondary", fontWeight: 600 }}
      >
                {t.toc.contents}
      </Typography>
      <List disablePadding>
        {headings.map((heading) => (
          <TocItem key={heading.id} heading={heading} expandedIds={expandedIds} onToggle={handleToggle} />
        ))}
      </List>
    </Box>
  );
}
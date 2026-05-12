"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { Box, Paper } from "@mui/material";
import CodeBlock from "./CodeBlock";
import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import TagIcon from "@mui/icons-material/Tag";
import { useReadingProgress, slugify } from "../reading/ReadingProgressContext";

interface MarkdownContentProps {
  content: string;
}

function HeadingWithAnchor({
  id,
  children,
  sx,
  level,
}: {
  id: string;
  children: React.ReactNode;
  sx?: object;
  level: 1 | 2 | 3;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const Tag = `h${level}` as const;

  const levelIndicator = {
    1: "H1",
    2: "H2",
    3: "H3",
  }[level];

  return (
    <Tag
      id={id}
      data-heading-id={id}
      style={{ scrollMarginTop: "80px", position: "relative" }}
    >
      <Box
        component="span"
        sx={{
          position: "absolute",
          left: -20,
          top: 20,
          fontSize: "0.6em",
          color: "text.disabled",
          fontWeight: 500,
          userSelect: "none",
          opacity: 0.6,
          zIndex: 3,
          // backgroundColor: "#88888833",
          padding: "4px",
        }}
      >
        {levelIndicator}
      </Box>
      <Paper
        component="span"
        elevation={0}
        onClick={handleClick}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          py: 0.25,
          // bgcolor: "action.hover",
          borderRadius: 1,
          cursor: "pointer",
          fontWeight: "inherit",
          fontSize: "inherit",
          lineHeight: "inherit",
          "&:hover": { bgcolor: "action.selected" },
          ...sx,
        }}
      >
        <TagIcon sx={{ fontSize: "0.9em", color: "text.secondary" }} />
        <span style={{ fontWeight: "inherit", fontSize: "inherit", padding: "0 30px 0 5px", margin: 0, borderRadius: "4px"}}>{children}</span>
      </Paper>
    </Tag>
  );
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const pathname = usePathname();
  const { setHeadings, setActiveHeadingId } = useReadingProgress();
  const contentRef = useRef<HTMLDivElement>(null);

  const updateActiveHeading = useCallback(() => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll("h1, h2, h3");
    if (headings.length === 0) return;

    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const triggerPoint = scrollY + viewportHeight * 0.3;

    let activeId: string | null = null;
    let lastTop = -Infinity;

    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      const absoluteTop = rect.top + scrollY;

      if (absoluteTop <= triggerPoint && absoluteTop > lastTop) {
        lastTop = absoluteTop;
        activeId = heading.getAttribute("data-heading-id");
      }
    });

    if (activeId && activeId !== window.location.hash.slice(1)) {
      setActiveHeadingId(activeId);
    }
  }, [setActiveHeadingId]);

  useEffect(() => {
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    updateActiveHeading();

    return () => {
      window.removeEventListener("scroll", updateActiveHeading);
    };
  }, [updateActiveHeading]);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [pathname]);

  useEffect(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: { id: string; text: string; level: 1 | 2 | 3 }[] = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length as 1 | 2 | 3;
      const text = match[2].trim();
      const id = slugify(text);
      headings.push({ id, text, level });
    }

    const result: { id: string; text: string; level: 1 | 2 | 3; children: typeof result }[] = [];
    const parentStack = [{ level: 0, children: result }];

    headings.forEach((h) => {
      const node = { ...h, children: [] as typeof result };
      while (parentStack.length > 1 && parentStack[parentStack.length - 1].level >= h.level) {
        parentStack.pop();
      }
      parentStack[parentStack.length - 1].children.push(node);
      parentStack.push(node);
    });

    setHeadings(result);
  }, [content, setHeadings]);

  return (
    <Box
      ref={contentRef}
      sx={{
        "& h1": { mt: 4, mb: 2, mx: 2, fontWeight: "bold", fontSize: "2rem" },
        "& h2": { mt: 4, mb: 2, mx: 2, fontWeight: "bold", fontSize: "1.5rem" },
        "& h3": { mt: 3, mb: 1, mx: 2, fontWeight: "bold", fontSize: "1.25rem"},
        "& p": { mb: 2, mx: 2, lineHeight: 1.7, color: "text.secondary" },
        "& ul, & ol": { mb: 2, pl: 4, mx: 2 },
        "& li": { mb: 0.5 },
        "& blockquote": {
          mb: 2,
          mx: 2,
          pl: 2,
          borderLeft: "4px solid",
          borderColor: "divider",
          fontStyle: "italic",
        },
        "& code": {
          bgcolor: "action.hover",
          px: 0.5,
          borderRadius: 0.5,
          fontFamily: "'JetBrains Mono', Consolas, monospace",
          fontSize: "0.9em",
        },
        "& table": { mb: 2, mx: 2, width: "calc(100% - 32px)", borderCollapse: "collapse" },
        "& th, & td": { border: 1, borderColor: "divider", p: 1 },
        "& th": { fontWeight: "bold" },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          h1: ({ children }) => (
            <HeadingWithAnchor
              id={slugify(String(children))}
              sx={{ fontSize: "2rem", fontWeight: "bold", mt: 4, mb: 2}}
              level={1}
            >
              {children}
            </HeadingWithAnchor>
          ),
          h2: ({ children }) => (
            <HeadingWithAnchor
              id={slugify(String(children))}
              sx={{ fontSize: "1.5rem", fontWeight: "bold", mt: 4, mb: 2}}
              level={2}
            >
              {children}
            </HeadingWithAnchor>
          ),
          h3: ({ children }) => (
            <HeadingWithAnchor
              id={slugify(String(children))}
              sx={{ fontSize: "1.25rem", fontWeight: "bold", mt: 3, mb: 1}}
              level={3}
            >
              {children}
            </HeadingWithAnchor>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
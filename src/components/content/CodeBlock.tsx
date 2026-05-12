"use client";

import { useState, useMemo } from "react";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const language = className?.replace("language-", "") || "";

  const codeText = useMemo(() => extractText(children), [children]);
  const lines = useMemo(() => codeText.split("\n"), [codeText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        mb: 2,
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: isDark ? "#1e1e1e" : "#ffffff",
        border: 1,
        borderColor: isDark ? "#3c3c3c" : "#e0e0e0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1.5,
          py: 0.5,
          bgcolor: isDark ? "#252526" : "#ebebeb",
          borderBottom: 1,
          borderColor: isDark ? "#3c3c3c" : "#d5d5d5",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: isDark ? "#808080" : "#6d6d6d",
            fontFamily: "'JetBrains Mono', Consolas, monospace",
            fontSize: "0.7rem",
          }}
        >
          {language || "code"}
        </Typography>
        <Tooltip title={copied ? "Copied!" : "Copy"}>
          <IconButton
            onClick={handleCopy}
            size="small"
            sx={{
              color: isDark ? "#808080" : "#6d6d6d",
              p: 0.5,
              "&:hover": {
                color: isDark ? "#fff" : "#000",
                bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              },
            }}
          >
            {copied ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          overflow: "auto",
          maxHeight: "500px"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "right",
            userSelect: "none",
            bgcolor: isDark ? "#252526" : "#ebebeb",
            borderRight: 1,
            borderColor: isDark ? "#3c3c3c" : "#d5d5d5",
            py: 1.5,
            pr: 1.5,
            pl: 1.5,
            "& .line-number": {
              width: "0.6ch",
              p: 0,
              fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
              fontSize: "0.92rem",
              lineHeight: 1.6,
              color: isDark ? "#5a5a5a" : "#959595",
              minWidth: "0.8ch",
            },
          }}
        >
          {lines.map((_, i) => (
            <Box key={i} className="line-number" sx={i === 0 ? { mt: "2px" } : {m: 0}}>
              {i + 1}
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 1.5,
            pl: 2,
            overflowX: "auto",
            "& .hljs": {
              m: 0,
              p: 0,
              bgcolor: "transparent",
              fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              color: isDark ? "#d4d4d4" : "#24292e",
              "& .hljs-keyword": { color: isDark ? "#569cd6" : "#d73a49" },
              "& .hljs-string": { color: isDark ? "#ce9178" : "#032f62" },
              "& .hljs-number": { color: isDark ? "#b5cea8" : "#005cc5" },
              "& .hljs-comment": { color: isDark ? "#6a9955" : "#6a737d" },
              "& .hljs-function": { color: isDark ? "#dcdcaa" : "#6f42c1" },
              "& .hljs-class": { color: isDark ? "#4ec9b0" : "#22863a" },
              "& .hljs-variable": { color: isDark ? "#9cdcfe" : "#e36209" },
              "& .hljs-operator": { color: isDark ? "#d4d4d4" : "#005cc5" },
              "& .hljs-punctuation": { color: isDark ? "#d4d4d4" : "#24292e" },
              "& .hljs-property": { color: isDark ? "#9cdcfe" : "#005cc5" },
              "& .hljs-params": { color: isDark ? "#d4d4d4" : "#24292e" },
              "& .hljs-built_in": { color: isDark ? "#4ec9b0" : "#22863a" },
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children: React.ReactNode } }).props.children);
  }
  return "";
}
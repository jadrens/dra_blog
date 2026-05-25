"use client";

import { useState, useMemo } from "react";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useI18n } from "@/lib/i18n";
import { mdiLanguageTypescript
, mdiLanguagePython
, mdiLanguageRust
, mdiLanguageGo
, mdiLanguageJava
, mdiLanguageC
, mdiLanguageCpp
, mdiLanguageJavascript
, mdiCodeTags,
mdiBash,
mdiLanguageHtml5,
mdiLanguageCss3,
mdiCodeJson,
 } from "@mdi/js"
import {Icon} from "@mdi/react"

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

const languageColorsLight: Record<string, string> = {
  javascript: "#c49c08",
  js: "#c49c08",
  typescript: "#2565ae",
  ts: "#2565ae",
  python: "#2e6dad",
  py: "#2e6dad",
  bash: "#2e8c1c",
  sh: "#2e8c1c",
  shell: "#2e8c1c",
  html: "#c23d1e",
  css: "#3d2666",
  json: "#444444",
  rust: "#b85c32",
  go: "#0095c2",
  java: "#8a4b1c",
  cpp: "#c93068",
  c: "#444444",
};
const languageColorsDark: Record<string, string> = {
  javascript: "#f7df1e",
  js: "#f7df1e",
  typescript: "#3178c6",
  ts: "#3178c6",
  python: "#3572A5",
  py: "#3572A5",
  bash: "#4EAA25",
  sh: "#4EAA25",
  shell: "#4EAA25",
  html: "#e34c26",
  css: "#563d7c",
  json: "#bbbbbb",
  rust: "#dea584",
  go: "#00ADD8",
  java: "#b07219",
  cpp: "#f34b7d",
  c: "#cccccc",
};

const languageIcons: Record<string, string> = {
  javascript: mdiLanguageJavascript,
  js: mdiLanguageJavascript,
  typescript: mdiLanguageTypescript,
  ts: mdiLanguageTypescript,
  python: mdiLanguagePython,
  py: mdiLanguagePython,
  bash: mdiBash,
  sh: mdiBash,
  shell: mdiBash,
  html: mdiLanguageHtml5,
  css: mdiLanguageCss3,
  json: mdiCodeJson,
  rust: mdiLanguageRust,
  go: mdiLanguageGo,
  java: mdiLanguageJava,
  cpp: mdiLanguageCpp,
  c: mdiLanguageC,
};

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useI18n();
  const language = className?.split(" ").at(-1)?.replace("language-", "") || "";
  const iconColor = (isDark ? languageColorsDark[language] : languageColorsLight[language]) || (isDark ? "#808080" : "#6d6d6d");
  const LanguageIcon = <Icon 
  path={languageIcons[language] || mdiCodeTags} 
  size={0.6}
  color={iconColor}
  style={{ fontSize: "0.9rem" }}
/>;


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
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {LanguageIcon}
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
        </Box>
        <Tooltip title={copied ? t.codeBlock.copied : t.codeBlock.copy}>
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



      {/* code */}
      <Box
        sx={{
          display: "flex",
          overflow: "auto",
          maxHeight: "500px"
        }}
      >
        {/* line numbers */}
        {/* <Box
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
              fontSize: "0.85rem",
              lineHeight: 1.6,
              color: isDark ? "#5a5a5a" : "#959595",
              minWidth: "0.8ch",
            },
          }}
        >
          {lines.map((_, i) => (
            <Box key={i} className="line-number">
              {i + 1}
            </Box>
          ))}
        </Box> */}

        {/* code */}
        <Box
          sx={{
            flex: 1,
            p: 1.5,
            pl: 2,
            py: 1.5,
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
"use client";

import { useState, useEffect } from "react";
import { Box, Breadcrumbs, Chip, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MarkdownContent from "@/components/content/MarkdownContent";
import TableOfContents from "@/components/toc/TableOfContents";
import TableOfContentsDrawer from "@/components/toc/TableOfContentsDrawer";
import FloatingTOCButton from "@/components/toc/FloatingTOCButton";
import ReadingProgressBar from "@/components/reading/ReadingProgressBar";
import BackToTopButton from "@/components/reading/BackToTopButton";
import { ReadingProgressProvider } from "@/components/reading/ReadingProgressContext";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useI18n } from "@/lib/i18n";
import { Locale } from "@/lib/posts";
import { SITE_CONFIG } from "@/lib/config";

interface PostClientProps {
  post: {
    slug: string;
    title: string;
    date: string;
    content: string;
    tags: string[];
  };
  views: number;
  slug: string;
  incrementView: (slug: string) => Promise<void>;
  locale: Locale;
}

function getRelativeTime(dateStr: string, t: any): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.abs(now.getTime() - date.getTime());
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  const ta = t?.blog?.timeAgo;
  const s = (n: number, sing: string, pl: string) =>
    n === 1 ? `${n} ${sing}` : `${n} ${pl}`;

  if (years > 0) {
    const y = years;
    const m = months % 12;
    const d = days % 30;
    if (m > 0 && d > 0) return `${s(y, ta.year, ta.years)} ${s(m, ta.month, ta.months)} ${s(d, ta.day, ta.days)}`;
    if (m > 0) return `${s(y, ta.year, ta.years)} ${s(m, ta.month, ta.months)}`;
    return `${s(y, ta.year, ta.years)}`;
  }
  if (months > 0) {
    const m = months;
    const d = days % 30;
    const h = hours % 24;
    if (d > 0 && h > 0) return `${s(m, ta.month, ta.months)} ${s(d, ta.day, ta.days)} ${s(h, ta.hour, ta.hours)}`;
    if (d > 0) return `${s(m, ta.month, ta.months)} ${s(d, ta.day, ta.days)}`;
    return `${s(m, ta.month, ta.months)}`;
  }
  if (days > 0) {
    const d = days;
    const h = hours % 24;
    const min = minutes % 60;
    if (h > 0 && min > 0) return `${s(d, ta.day, ta.days)} ${s(h, ta.hour, ta.hours)} ${s(min, ta.minute, ta.minutes)}`;
    if (h > 0) return `${s(d, ta.day, ta.days)} ${s(h, ta.hour, ta.hours)}`;
    return `${s(d, ta.day, ta.days)}`;
  }
  if (hours > 0) {
    const h = hours;
    const min = minutes % 60;
    if (min > 0) return `${s(h, ta.hour, ta.hours)} ${s(min, ta.minute, ta.minutes)}`;
    return `${s(h, ta.hour, ta.hours)}`;
  }
  if (minutes > 0) {
    return `${s(minutes, ta.minute, ta.minutes)}`;
  }
  return `${s(seconds, ta.second, ta.seconds)}`;
}

function PostContent({ post, views, slug, incrementView, locale }: PostClientProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [localViews, setLocalViews] = useState(views);
  const [mounted, setMounted] = useState(false);

  const wordCount = post.content.replace(/\s/g, "").length;

  useScrollProgress();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    incrementView(slug);
    setLocalViews((v) => v + 1);
  }, [slug, incrementView]);

  return (
    <>
      <TableOfContentsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <FloatingTOCButton onClick={() => setDrawerOpen(true)} />
      <ReadingProgressBar />
      <BackToTopButton />
      <Box sx={{ display: { xs: "block", sm: "grid" }, gridTemplateColumns: { sm: "250px 1fr" }, gap: 4 }}>
        <TableOfContents />
        <Box component="main" sx={{ width: '100%', pr: { sm: '250px' }, pl: { sm: '76px', xs: 3 }, py: 8 }}>
          <Breadcrumbs sx={{ mb: 2, animation: 'fadeIn 0.5s ease-out', animationDelay: '0.1s', animationFillMode: 'both' }}>
            <Link
              href={`/blog/${locale}`}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 no-underline transition-colors duration-200"
            >
                            {t.blog.backToPosts}
            </Link>
            <Typography color="text.primary" className="text-sm">
              {post.title}
            </Typography>
          </Breadcrumbs>
          <article>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  animation: mounted ? 'slideUp 0.6s ease-out' : 'none',
                  animationDelay: '0.2s',
                  animationFillMode: 'both',
                }}
              >
                {post.title}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    mb: 1,
                    flexWrap: "wrap",
                    animation: mounted ? 'fadeIn 0.5s ease-out' : 'none',
                    animationDelay: '0.4s',
                    animationFillMode: 'both',
                  }}
                >
                  <Tooltip title={getRelativeTime(post.date, t)}>
                    <Chip
                      icon={<EventIcon />}
                      label={post.date}
                      size="small"
                      variant="outlined"
                      sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
                      }}
                    />
                  </Tooltip>
                  <Chip
                    icon={<VisibilityIcon />}
                    label={`${localViews} ${t.blog.views}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
                    }}
                  />
                  <Chip
                    icon={<TextFieldsIcon />}
                    label={`${wordCount} ${t.blog.characters}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    animation: mounted ? 'fadeIn 0.5s ease-out' : 'none',
                    animationDelay: '0.5s',
                    animationFillMode: 'both',
                  }}
                >
                  {post.tags.map((tag) => (
                    <Chip
                      key={tag}
                      icon={<LocalOfferIcon />}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'secondary.main',
                        color: theme.palette.secondary.main,
                        transition: 'all 0.2s ease',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: 2, bgcolor: 'secondary.main', color: theme.palette.secondary.contrastText }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                animation: mounted ? 'fadeIn 0.6s ease-out' : 'none',
                animationDelay: '0.5s',
                animationFillMode: 'both',
              }}
            >
              <MarkdownContent content={post.content} />
            </Box>
            <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Chip
                component="a"
                href={`${SITE_CONFIG.githubRepo}/edit/${SITE_CONFIG.githubBranch}/content/posts/${locale}/${post.slug}.md`}
                target="_blank"
                rel="noopener noreferrer"
                icon={<EditIcon />}
                label={t.blog.editOnGithub}
                variant="outlined"
                size="small"
                clickable
                sx={{ '& .MuiChip-icon': { ml: 1 }, '& .MuiChip-label': { pr: 1.5 } }}
                deleteIcon={<ArrowForwardIcon />}
                onDelete={() => {}}
              />
            </Box>
          </article>
        </Box>
      </Box>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default function PostClient({ post, views, slug, incrementView, locale }: PostClientProps) {
  return (
    <ReadingProgressProvider>
      <PostContent post={post} views={views} slug={slug} incrementView={incrementView} locale={locale} />
    </ReadingProgressProvider>
  );
}
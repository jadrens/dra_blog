"use client";

import { useState, useEffect } from "react";
import { Box, Breadcrumbs, Typography, Chip } from "@mui/material";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MarkdownContent from "@/components/content/MarkdownContent";
import TableOfContents from "@/components/toc/TableOfContents";
import TableOfContentsDrawer from "@/components/toc/TableOfContentsDrawer";
import FloatingTOCButton from "@/components/toc/FloatingTOCButton";
import ReadingProgressBar from "@/components/reading/ReadingProgressBar";
import BackToTopButton from "@/components/reading/BackToTopButton";
import { ReadingProgressProvider } from "@/components/reading/ReadingProgressContext";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useI18n } from "@/lib/i18n";

interface PostClientProps {
  post: {
    title: string;
    date: string;
    content: string;
    tags: string[];
  };
  views: number;
  slug: string;
  incrementView: (slug: string) => Promise<void>;
}

function PostContent({ post, views, slug, incrementView }: PostClientProps) {
  const { t } = useI18n();
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
              href="/blog"
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
                      sx={{
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                        transition: 'all 0.2s ease',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
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

export default function PostClient({ post, views, slug, incrementView }: PostClientProps) {
  return (
    <ReadingProgressProvider>
      <PostContent post={post} views={views} slug={slug} incrementView={incrementView} />
    </ReadingProgressProvider>
  );
}
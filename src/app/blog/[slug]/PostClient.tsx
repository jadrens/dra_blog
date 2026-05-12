"use client";

import { useState, useEffect } from "react";
import { Box, Breadcrumbs, Typography, Chip } from "@mui/material";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";
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
  };
  views: number;
  slug: string;
  incrementView: (slug: string) => Promise<void>;
}

function PostContent({ post, views, slug, incrementView }: PostClientProps) {
  const { t } = useI18n();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [localViews, setLocalViews] = useState(views);

  useScrollProgress();

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
        <Box component="main" sx={{ width: '100%', pr: { sm: '250px' }, pl: { sm: '76px' }, py: 8 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link
              href="/blog"
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 no-underline"
            >
                            {t.blog.backToPosts}
            </Link>
            <Typography color="text.primary" className="text-sm">
              {post.title}
            </Typography>
          </Breadcrumbs>
          <article>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "primary.light" }}>
                {post.title}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                <Chip
                  icon={<EventIcon />}
                  label={post.date}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<VisibilityIcon />}
                  label={`${localViews} ${t.blog.views}`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
            <MarkdownContent content={post.content} />
          </article>
        </Box>
      </Box>
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
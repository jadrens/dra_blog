"use client";

import Link from "next/link";
import { Typography, Box, Card, CardContent, Chip, alpha } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@mui/material/styles";

interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

interface BlogContentProps {
  posts: Post[];
  allViews: Record<string, number>;
}

export default function BlogContent({ posts, allViews }: BlogContentProps) {
  const { t } = useI18n();
  const theme = useTheme();

  return (
    <Box component="main" className="flex-1 mx-auto w-full max-w-4xl sm:px-4 px-6 py-8">
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        {t.blogPage.posts}
      </Typography>
      {posts.length === 0 ? (
        <Typography color="text.secondary">{t.blogPage.noPosts}</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              <Card sx={{ transition: "box-shadow 0.2s", "&:hover": { boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}` } }}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "medium" }}>
                    {post.title}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap", mb: 1 }}>
                    {post.tags.map((tag) => (
                      <Chip
                        key={tag}
                        icon={<LocalOfferIcon />}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
                    <Chip
                      icon={<CalendarTodayIcon />}
                      label={post.date}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<VisibilityIcon />}
                      label={`${allViews[post.slug] || 0} ${t.blog.views}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
}
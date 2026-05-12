"use client";

import Link from "next/link";
import { Typography, Box, Card, CardContent, Chip } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useI18n } from "@/lib/i18n";

interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
}

interface BlogContentProps {
  posts: Post[];
  allViews: Record<string, number>;
}

export default function BlogContent({ posts, allViews }: BlogContentProps) {
  const { t } = useI18n();

  return (
    <Box component="main" className="flex-1 mx-auto w-full max-w-4xl px-4 py-8">
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        {t.blogPage.posts}
      </Typography>
      {posts.length === 0 ? (
        <Typography color="text.secondary">{t.blogPage.noPosts}</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              <Card sx={{ transition: "box-shadow 0.2s", "&:hover": { boxShadow: 6 } }}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "medium" }}>
                    {post.title}
                  </Typography>
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
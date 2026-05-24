import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getSearchIndex, PostMeta } from "./search-index";

export type Locale = "en" | "zh";

function getPostsDirectory(locale: Locale): string {
  return path.join(process.cwd(), `content/posts/${locale}`);
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

export function getPostSlugs(locale: Locale): string[] {
  const index = getSearchIndex(locale);
  return index.postsByDate.map((p) => p.slug);
}

export function getPostBySlug(slug: string, locale: Locale): Post {
  const meta = getSearchIndex(locale).postsByDate.find((p) => p.slug === slug);
  if (!meta) {
    return { slug, title: "Not Found", date: "", content: "", tags: [] };
  }

  const postsDirectory = getPostsDirectory(locale);
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { content } = matter(fileContents);

  return {
    slug: meta.slug,
    title: meta.title,
    date: meta.date,
    content,
    tags: meta.tags,
  };
}

export function getAllPosts(locale: Locale): Post[] {
  const index = getSearchIndex(locale);
  return index.postsByDate.map((meta: PostMeta) => {
    const fullPath = path.join(getPostsDirectory(locale), `${meta.slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { content } = matter(fileContents);
    return {
      slug: meta.slug,
      title: meta.title,
      date: meta.date,
      content,
      tags: meta.tags,
    };
  });
}
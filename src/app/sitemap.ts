import { MetadataRoute } from "next";
import { getAllPosts, Locale } from "@/lib/posts";
import { SITE_CONFIG } from "@/lib/config";

const locales: Locale[] = ["en", "zh"];

export default function sitemap(): MetadataRoute.Sitemap {
  const allPages: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Add blog pages for each locale
  for (const locale of locales) {
    allPages.push({
      url: `${SITE_CONFIG.baseUrl}/blog/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });

    const posts = getAllPosts(locale);
    const postPages = posts.map((post) => ({
      url: `${SITE_CONFIG.baseUrl}/blog/${locale}/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
    allPages.push(...postPages);
  }

  return allPages;
}
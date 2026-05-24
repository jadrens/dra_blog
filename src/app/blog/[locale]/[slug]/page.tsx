import Navbar from "@/components/layout/Navbar";
import { getPostBySlug, Locale } from "@/lib/posts";
import { getPostView, incrementView } from "../../actions";
import PostClient from "./PostClient";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug, locale);
  return {
    title: post.title,
    description: `Post: ${post.title}`,
  };
}

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: Props) {
  const { slug, locale } = await params;
  const [post, views] = await Promise.all([getPostBySlug(slug, locale), getPostView(slug)]);

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <Navbar />
      <PostClient post={post} views={views} slug={slug} incrementView={incrementView} locale={locale} />
    </div>
  );
}
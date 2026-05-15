import Navbar from "@/components/layout/Navbar";
import { getPostBySlug } from "@/lib/posts";
import { getPostView, incrementViewCount } from "./actions";
import PostClient from "./PostClient";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post.title,
    description: `Post: ${post.title}`,
  };
}

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [post, views] = await Promise.all([getPostBySlug(slug), getPostView(slug)]);

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <Navbar />
      <PostClient post={post} views={views} slug={slug} incrementView={incrementViewCount} />
    </div>
  );
}
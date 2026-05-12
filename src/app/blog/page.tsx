import Navbar from "@/components/layout/Navbar";
import { getAllPosts } from "@/lib/posts";
import { getAllPostViews } from "@/lib/db";
import BlogContent from "./BlogContent";

export const metadata = {
  title: "Posts - My Blog",
  description: "All blog posts",
};

export default async function BlogPage() {
  const posts = getAllPosts();
  const allViews = await getAllPostViews();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BlogContent posts={posts} allViews={allViews} />
    </div>
  );
}
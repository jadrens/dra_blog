import Navbar from "@/components/layout/Navbar";
import { getPosts, getAllViews } from "./actions";
import BlogContent from "./BlogContent";

export const metadata = {
  title: "Posts - My Blog",
  description: "All blog posts",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPosts();
  const allViews = await getAllViews();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BlogContent posts={posts} allViews={allViews} />
    </div>
  );
}
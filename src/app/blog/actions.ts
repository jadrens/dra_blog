"use server";

import { getAllPosts } from "@/lib/posts";
import { getAllPostViews, getPostViews } from "@/lib/db";
import { incrementPostViews } from "@/lib/db";

export async function getPosts() {
  return getAllPosts();
}

export async function getPostView(slug: string) {
  return getPostViews(slug);
}

export async function getAllViews() {
  return getAllPostViews();
}

export async function incrementView(slug: string): Promise<void> {
  await incrementPostViews(slug);
}
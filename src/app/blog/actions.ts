"use server";

import { getAllPosts, Locale } from "@/lib/posts";
import { getAllPostViews, getPostViews } from "@/lib/db";
import { incrementPostViews } from "@/lib/db";

export async function getPosts(locale: Locale) {
  return getAllPosts(locale);
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
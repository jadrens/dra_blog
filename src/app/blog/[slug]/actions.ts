"use server";

import { incrementPostViews } from "@/lib/db";

export async function incrementView(slug: string): Promise<void> {
  await incrementPostViews(slug);
}

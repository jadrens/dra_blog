"use client";

import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from "react";

export interface Heading {
  id: string;
  text: string;
  level: 1 | 2 | 3;
  children: Heading[];
}

interface ReadingProgressState {
  headings: Heading[];
  activeHeadingId: string | null;
  readingProgress: number;
  setHeadings: (headings: Heading[]) => void;
  setActiveHeadingId: (id: string | null) => void;
  setReadingProgress: (progress: number) => void;
}

const ReadingProgressContext = createContext<ReadingProgressState | undefined>(undefined);

export function ReadingProgressProvider({ children }: { children: ReactNode }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (activeHeadingId) {
      const newUrl = `${window.location.pathname}${window.location.search}#${activeHeadingId}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [activeHeadingId]);

  const value = useMemo(
    () => ({
      headings,
      activeHeadingId,
      readingProgress,
      setHeadings,
      setActiveHeadingId,
      setReadingProgress,
    }),
    [headings, activeHeadingId, readingProgress]
  );

  return (
    <ReadingProgressContext.Provider value={value}>
      {children}
    </ReadingProgressContext.Provider>
  );
}

export function useReadingProgress() {
  const context = useContext(ReadingProgressContext);
  if (!context) {
    throw new Error("useReadingProgress must be used within ReadingProgressProvider");
  }
  return context;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    // .replace(/[^\w\s-]/g, "")
    .replace(".", "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  const parentStack = [{ level: 0, children: headings }];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);

    const heading: Heading = { id, text, level: level as 1 | 2 | 3, children: [] };

    while (parentStack.length > 1 && parentStack[parentStack.length - 1].level >= level) {
      parentStack.pop();
    }

    parentStack[parentStack.length - 1].children.push(heading);
    parentStack.push(heading);
  }
  return headings;
}
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Inter } from "next/font/google";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import "katex/dist/katex.min.css";
import ThemeRegistry from "@/components/layout/ThemeRegistry/ThemeRegistry";
import { I18nProvider } from "@/lib/i18n";
import LoadingBar from "@/components/layout/LoadingBar";
import Footer from "@/components/layout/Footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "dragonren-blog",
  description: "A blog with markdown and LaTeX support",
  other: {
    "google-site-verification": "ACpqVvUPYrrYYHEZh7Ew7z7TsxTntlmql8n7b97V164",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${nunito.variable} ${inter.variable}`}>
      <body className="min-h-full antialiased" suppressHydrationWarning>
        <ThemeRegistry>
        <I18nProvider>
          <LoadingBar />
          {children}
          <Footer />
        </I18nProvider>
      </ThemeRegistry>
      </body>
    </html>
  );
}
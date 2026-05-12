import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import "katex/dist/katex.min.css";
import ThemeRegistry from "@/components/layout/ThemeRegistry/ThemeRegistry";
import { I18nProvider } from "@/lib/i18n";
import LoadingBar from "@/components/layout/LoadingBar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Blog",
  description: "A blog with markdown and LaTeX support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
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
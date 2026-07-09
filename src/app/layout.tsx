import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeStyles } from "@/components/theme/theme-styles";
import { getContentValue, getSiteContent } from "@/lib/site-content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: getContentValue(content, "site.name"),
    description: getContentValue(content, "site.description"),
    icons: {
      icon: "/logo.png",
      apple: "/logo.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <ThemeStyles />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--color-background)] font-sans text-[var(--color-text)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const TITLE = "Darter | Native apps for the world's leading aesthetic practices.";
const DESCRIPTION =
  "Darter designs and builds bespoke iOS and Android apps for the world's best-run aesthetic practices. Hand-built, published under your name.";

export const metadata: Metadata = {
  metadataBase: new URL("https://dartertech.com"),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: "https://dartertech.com",
    siteName: "Darter",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}

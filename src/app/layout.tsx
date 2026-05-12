import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const TITLE = "Darter | Custom Native Apps for MedSpas & Aesthetic Practices";
const DESCRIPTION =
  "Darter builds custom-branded iOS and Android apps for high-end MedSpas. Your practice in your patients' pocket — booking, push, loyalty, and referrals.";

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

import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono, Space_Grotesk, Unbounded } from "next/font/google";
import Providers from "@/components/fx/Providers";
import Cursor from "@/components/fx/Cursor";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["italic"],
  axes: ["SOFT", "opsz"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const TITLE = "DARTER | We demand the doom scroll.";
const DESCRIPTION =
  "DARTER is an attention engine. It writes, animates and posts movie-quality AI stories every day, for brands and faceless accounts. Not slop. Stories people can't scroll past.";

export const metadata: Metadata = {
  metadataBase: new URL("https://dartertech.com"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: "https://dartertech.com",
    siteName: "DARTER",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#070b14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${fraunces.variable} ${grotesk.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
        <Cursor />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}

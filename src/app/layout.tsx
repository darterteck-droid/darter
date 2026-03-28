import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Darter | AI Receptionist for Aesthetic Clinics",
  description:
    "Darter is the 24/7 AI receptionist built for aesthetic clinics. Never miss another call. Every appointment booked. Every dollar captured.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Darter | AI Receptionist for Aesthetic Clinics",
    description:
      "The 24/7 AI receptionist that ensures your aesthetic clinic never misses a call.",
    type: "website",
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

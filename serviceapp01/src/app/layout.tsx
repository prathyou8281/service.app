import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ServiceHub | Premium Doorstep IT Services",
  description: "Global standard IT maintenance, hardware repair, and professional support services delivered at your doorstep.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-blue-100 selection:text-blue-900`}
      >
        {/* ✅ Global Unified Header */}
        <Nav />

        {/* ✅ Page Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* ✅ Global Unified Footer */}
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HireFlow | Recruitment Management",
  description:
    "HireFlow is a smart recruitment and applicant tracking platform for managing jobs, candidates, applications, interviews, and recruitment analytics. Developed by Pratyush Choudhury.",
  applicationName: "HireFlow",
  keywords: [
    "HireFlow",
    "Applicant Tracking System",
    "Recruitment Management",
    "Candidate Management",
    "Job Management",
    "Interview Scheduling",
    "Recruitment Analytics",
  ],
  authors: [{ name: "Pratyush Choudhury" }],
  creator: "Pratyush Choudhury",
  openGraph: {
    title: "HireFlow | Recruitment Management",
    description:
      "Smart Recruitment & Applicant Tracking. Manage jobs, candidates, applications, and interviews in one place.",
    siteName: "HireFlow",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireFlow | Recruitment Management",
    description:
      "Smart Recruitment & Applicant Tracking. Developed by Pratyush Choudhury.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06a2f5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
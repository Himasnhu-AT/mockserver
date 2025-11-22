import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mockserver.himanshuat.com"),
  title: {
    default: "MockServer CLI | Chaos Engineering & API Simulation",
    template: "%s | MockServer CLI",
  },
  description:
    "The ultimate dynamic mock server for frontend developers. Simulate network failures, generate realistic data, and test error boundaries with built-in Chaos Engineering. Zero config required.",
  keywords: [
    "mock server",
    "chaos engineering",
    "api simulator",
    "frontend development",
    "network simulation",
    "fake api generator",
    "nodejs",
    "testing tools",
  ],
  authors: [{ name: "Himanshu" }],
  creator: "Himanshu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mockserver.himanshuat.com",
    title: "MockServer CLI - Instant Chaos Engineering for Frontend",
    description:
      "Spin up realistic APIs in seconds. Test how your app handles 500 errors, timeouts, and network drops without writing backend code.",
    siteName: "MockServer CLI",
    images: [
      {
        url: "/og-image.png", // Ensure you have this image in public/
        width: 1200,
        height: 630,
        alt: "MockServer CLI Dashboard",
      },
    ],
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "MockServer CLI | Chaos Engineering for Frontend",
  //   description:
  //     "Don't wait for the backend. Generate realistic data and simulate infrastructure failures instantly.",
  //   creator: "@yourhandle",
  //   images: ["/og-image.png"],
  // },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        {children}
        {/*<Footer />*/}
      </body>
    </html>
  );
}

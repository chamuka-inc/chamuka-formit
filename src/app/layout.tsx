import React from "react";
import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { TRPCReactProvider } from "@/lib/trpc/react";
import type { Metadata } from "next";
import ClientProvider from "@/components/ClientProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeAwareToast } from "@/components/theme/ThemeAwareToast";

export const metadata: Metadata = {
  metadataBase: new URL("https://chamuka-formit.vercel.app"),
  title: {
    default: "Chamuka FormIt - Modern Content Builder",
    template: "%s | Chamuka FormIt",
  },
  description:
    "Chamuka FormIt is a powerful, modern content builder application that helps you create, manage, and publish content with ease. Built with Next.js and TypeScript.",
  keywords: ["content builder", "form builder", "content management"],
  authors: [{ name: "Chamuka FormIt Team" }],
  creator: "Chamuka FormIt Team",
  publisher: "Chamuka FormIt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chamuka-formit.vercel.app",
    siteName: "Chamuka FormIt",
    title: "Chamuka FormIt - Modern Content Builder",
    description:
      "Create, manage, and publish content with ease using our modern content builder application.",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Chamuka FormIt Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chamuka FormIt - Modern Content Builder",
    description:
      "Create, manage, and publish content with ease using our modern content builder application.",
    images: ["/og-image.jpeg"],
    creator: "@chamukaformit",
  },
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
  verification: {
    google: "TODO: your-google-site-verification",
  },
  alternates: {
    canonical: "https://chamuka-formit.vercel.app",
  },
  manifest: "/manifest.json",
};

// This is the root layout that wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body className="antialiased selection:bg-primary/10 selection:text-primary">
        <ThemeProvider
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ClientProvider>
            <TRPCReactProvider>
              {children}
              <ThemeAwareToast />
            </TRPCReactProvider>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

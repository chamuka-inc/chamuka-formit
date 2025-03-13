import { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: {
    default: "Chamuka FormIt - Create and Share Forms",
    template: "%s | Chamuka FormIt",
  },
  description:
    "Create and share forms with ease using Chamuka FormIt. No coding required.",
  keywords: [
    "forms",
    "form builder",
    "online forms",
    "form creator",
    "form sharing",
  ],
  authors: [{ name: "Chamuka FormIt" }],
  creator: "Chamuka FormIt",
  publisher: "Chamuka FormIt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://chamuka-formit.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chamuka-formit.com",
    siteName: "Chamuka FormIt",
    title: "Chamuka FormIt - Create and Share Forms",
    description:
      "Create and share forms with ease using Chamuka FormIt. No coding required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chamuka FormIt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chamuka FormIt - Create and Share Forms",
    description:
      "Create and share forms with ease using Chamuka FormIt. No coding required.",
    images: ["/og-image.png"],
    creator: "@chamukaformit",
  },
  verification: {
    google: "your-verification-code", // Replace with your actual verification code
  },
};

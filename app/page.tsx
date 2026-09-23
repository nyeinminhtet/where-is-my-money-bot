import type { Metadata } from "next";
import LandingPageClient from "@/features/landing/landing-page-client";

export const metadata: Metadata = {
  title: "Where Is My Money — AI-Powered Telegram Finance Bot",
  description:
    "Track income, expenses, and budgets with voice, photos, or text in Myanmar or English. AI-powered personal finance bot for Telegram with a Mini App dashboard.",
  keywords: [
    "Telegram finance bot",
    "Myanmar expense tracker",
    "personal finance",
    "budget tracker",
    "AI expense logging",
    "မြန်မာ ငွေစာရင်း",
  ],
  openGraph: {
    title: "Where Is My Money — AI-Powered Telegram Finance Bot",
    description:
      "Track income, expenses, and budgets with voice, photos, or text. AI-powered personal finance bot for Telegram.",
    url: "/",
    siteName: "Where Is My Money",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Where Is My Money — Telegram Finance Bot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Where Is My Money — AI-Powered Telegram Finance Bot",
    description:
      "Track income, expenses, and budgets with voice, photos, or text. AI-powered personal finance bot for Telegram.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Where Is My Money",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Telegram",
  description:
    "AI-powered personal finance bot for Telegram. Log expenses with voice, receipt photos, or text in Myanmar and English.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  url: "https://t.me/where_is_my_money_mm_bot",
  screenshot: "/og-image.png",
};

const LandingPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPageClient />
    </>
  );
};

export default LandingPage;

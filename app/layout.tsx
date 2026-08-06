import Script from "next/script";

import Providers from "./providers";
import "./globals.css";
import { Nunito_Sans, Noto_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Metadata, Viewport } from "next";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.appUrl || "https://where-is-my-money-bot.vercel.app/",
  ),
  title: "Where Is My Money - Personal Finance Manager",
  description: "Track your expenses and budget easily in Telegram Mini App.",
  openGraph: {
    title: "Where Is My Money - Personal Finance Manager",
    description: "Track your expenses and budget easily in Telegram Mini App.",
    url: "/dashboard",
    siteName: "Where Is My Money",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Where Is My Money App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Where Is My Money - Personal Finance Manager",
    description: "Track your expenses and budget easily in Telegram Mini App.",
    images: ["/og-image.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // 👈 User က လက်နဲ့ Zoom ဆွဲလို့ မရအောင် တားဆီးပေးသည် (App-like feel ရစေရန်)
  viewportFit: "cover", // 👈 Mobile Notch တွေနဲ့ တသားတည်းဖြစ်စေရန်
};

const notoSansHeading = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("font-sans", nunitoSans.variable, notoSansHeading.variable)}
    >
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

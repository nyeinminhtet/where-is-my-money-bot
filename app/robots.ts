import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const robots = (): MetadataRoute.Robots => {
  const base = env.appUrl || "https://where-is-my-money-bot.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
};

export default robots;

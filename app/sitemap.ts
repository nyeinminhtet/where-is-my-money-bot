import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const sitemap = (): MetadataRoute.Sitemap => {
  const base = env.appUrl || "https://where-is-my-money-bot.vercel.app";

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
};

export default sitemap;

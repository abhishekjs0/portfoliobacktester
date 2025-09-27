import type { MetadataRoute } from "next";

const fallbackUrl = "https://portfoliobacktester.example";

function resolveBase(): string {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl;
  try {
    return new URL(candidate).origin;
  } catch {
    return new URL(fallbackUrl).origin;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = resolveBase();
  const lastModified = new Date();
  return [
    {
      url: `${base}/`,
      lastModified,
    },
    {
      url: `${base}/upload`,
      lastModified,
    },
    {
      url: `${base}/guide`,
      lastModified,
    },
    {
      url: `${base}/dashboard`,
      lastModified,
    },
  ];
}

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

export default function robots(): MetadataRoute.Robots {
  const base = resolveBase();
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/admin/", "/user_data/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

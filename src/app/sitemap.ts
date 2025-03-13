import { MetadataRoute } from "next";
import { db } from "@/lib/db";

interface PublishedForm {
  publicShareToken: string;
  updatedAt: Date;
  title: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://chamuka-formit.vercel.app";

  // Get all published forms
  const publishedForms = (await db.form.findMany({
    where: {
      status: "published",
      // Only include forms that should be publicly indexed
      isProFeature: false,
    },
    select: {
      publicShareToken: true,
      updatedAt: true,
      title: true,
    },
  })) as PublishedForm[];

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/forms`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  // Published form routes with high priority for SEO
  const formRoutes = publishedForms.map((form) => ({
    url: `${baseUrl}/s/${form.publicShareToken}`,
    lastModified: form.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9, // High priority for published forms
  }));

  return [...staticRoutes, ...formRoutes];
}

"use client";

import { WebPage, BreadcrumbList } from "schema-dts";

interface PublishedFormStructuredDataProps {
  form: {
    title: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
    publicShareToken: string;
  };
}

export function PublishedFormStructuredData({
  form,
}: PublishedFormStructuredDataProps) {
  const baseUrl = "https://chamuka-formit.vercel.app";

  const webPage: WebPage = {
    "@type": "WebPage",
    "@id": `${baseUrl}/s/${form.publicShareToken}`,
    name: form.title,
    description: form.description || `Fill out ${form.title}`,
    datePublished: form.createdAt.toISOString(),
    dateModified: form.updatedAt.toISOString(),
    isPartOf: {
      "@type": "WebSite",
      name: "Chamuka FormIt",
      url: baseUrl,
    },
  };

  const breadcrumb: BreadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Forms",
        item: `${baseUrl}/forms`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: form.title,
        item: `${baseUrl}/s/${form.publicShareToken}`,
      },
    ],
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([webPage, breadcrumb]),
      }}
    />
  );
}

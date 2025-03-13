import { Metadata } from "next";
import { db } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: { token: string };
}): Promise<Metadata> {
  // Fetch form data
  const form = await db.form.findUnique({
    where: { publicShareToken: params.token },
    select: {
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!form) {
    return {
      title: "Form Not Found",
      description: "The requested form could not be found.",
    };
  }

  return {
    title: `${form.title} | Chamuka FormIt`,
    description:
      form.description ||
      `Fill out ${form.title} - Created with Chamuka FormIt`,
    openGraph: {
      title: form.title,
      description:
        form.description ||
        `Fill out ${form.title} - Created with Chamuka FormIt`,
      type: "website",
      siteName: "Chamuka FormIt",
      locale: "en_US",
      url: `https://chamuka-formit.vercel.app/s/${params.token}`,
      images: [
        {
          url: "/og-image.jpeg",
          width: 1200,
          height: 630,
          alt: form.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: form.title,
      description:
        form.description ||
        `Fill out ${form.title} - Created with Chamuka FormIt`,
      images: ["/og-image.jpeg"],
    },
  };
}

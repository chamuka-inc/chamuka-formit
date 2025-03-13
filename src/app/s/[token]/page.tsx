import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import PublicFormClient from "@/components/form/PublicFormClient";
import { PublishedFormStructuredData } from "@/components/form/PublishedFormStructuredData";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ token: string }>;
}

// Metadata generator
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const token = params.token;

  // Fetch form data
  const form = await db.form.findUnique({
    where: { publicShareToken: token },
    select: {
      title: true,
      description: true,
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
  };
}

export default async function PublicFormPage(props: PageProps) {
  // Await the params Promise
  const params = await props.params;
  const token = params.token;

  const form = await db.form.findUnique({
    where: {
      publicShareToken: token,
    },
  });

  if (!form) {
    notFound();
  }

  return (
    <>
      <PublicFormClient form={form} />
      <PublishedFormStructuredData form={form} />
    </>
  );
}

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import PublicFormClient from "@/components/form/PublicFormClient";
import { PublishedFormStructuredData } from "@/components/form/PublishedFormStructuredData";

interface PageProps {
  params: {
    token: string;
  };
}

export default async function PublicFormPage({ params }: PageProps) {
  const form = await db.form.findUnique({
    where: {
      publicShareToken: params.token,
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

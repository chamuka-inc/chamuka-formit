import PublicLayout from "@/components/layout/PublicLayout";

export default async function FormLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <PublicLayout showToasts>{children}</PublicLayout>;
}

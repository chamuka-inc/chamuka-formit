import FormLayoutClient from "@/components/layout/FormLayoutClient";

export default async function FormLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <FormLayoutClient>{children}</FormLayoutClient>;
}

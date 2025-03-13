import { generateMetadata } from "./metadata";
import FormLayoutClient from "@/components/layout/FormLayoutClient";

export { generateMetadata };

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormLayoutClient>{children}</FormLayoutClient>;
}

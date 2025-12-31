import PageWrapper from "@/components/wrapper";

export default function LegalLayout({
  children,
}: {
    children: React.ReactNode;
}) {
  return <PageWrapper>{children}</PageWrapper>;
}   
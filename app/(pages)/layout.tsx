import { ContactSection } from "@/components/contact";
import PageWrapper from "@/components/wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageWrapper>
      {children}
      <ContactSection />
    </PageWrapper>
  );
}

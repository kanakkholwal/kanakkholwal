import { ContactSection } from "@/components/contact";
import PageWrapper from "@/components/wrapper";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_pages")({
  component: () => (
    <PageWrapper>
      <Outlet />
      <ContactSection />
    </PageWrapper>
  ),
});

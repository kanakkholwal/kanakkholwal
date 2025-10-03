import PageWrapper from "@/components/wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <PageWrapper ><div className="max-w-(--max-app-width) mx-auto">{children}</div></PageWrapper>;
}
import { cn } from "@/lib/utils";


interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}
export function StaticSection({ children, className, ...props }: SectionProps) {
    return (
        <section {...props} className={cn("max-w-4xl mx-auto w-full px-4 py-16 md:py-24", className)}>
            {children}
        </section>
    )
}

export function DynamicSection({ children, className, ...props }: SectionProps) {
    return (
        <section {...props} className={cn("max-w-app mx-auto w-full px-4 md:px-12 py-20 md:py-32", className)}>
            {children}
        </section>
    )
}


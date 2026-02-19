import { cn } from "@/lib/utils";

export const SectionHeader = ({
  label,
  serifText,
  mainText,
  description,
  align = "center",
}: {
  label: string;
  serifText: string;
  mainText: string;
  description?: string;
  align?: "center" | "left";
}) => (
  <div
    className={cn(
      "flex flex-col mb-16 space-y-4",
      align === "center" ? "items-center text-center" : "items-start text-left",
    )}
  >
    <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
      {` //`} {label}
    </span>
    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
      <span className="font-instrument-serif italic font-normal text-muted-foreground/80 mr-3">
        {serifText}
      </span>
      <span className="text-colorful-titanium">{mainText}</span>
    </h2>
    {description && (
      <p className="max-w-xl text-muted-foreground text-lg leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

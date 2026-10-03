import type { ComponentProps, ReactNode } from "react";
import { Label } from "@/components/ui/label/label";
import { Separator } from "@/components/ui/separator/separator";
import { cn } from "@/lib/cn";
import {
  type FieldErrorEntry,
  type FieldLegendVariant,
  type FieldOrientation,
  type FieldSize,
  field,
  fieldErrorMessages,
  fieldLegend,
} from "./variants";

export type { FieldErrorEntry, FieldLegendVariant, FieldOrientation, FieldSize };

const s = field();

export function FieldSet({ className, size = "default", ...props }: ComponentProps<"fieldset"> & { size?: FieldSize }) {
  return (
    <fieldset data-slot="field-set" data-size={size} className={cn(field({ size }).set(), className)} {...props} />
  );
}

export function FieldLegend({
  className,
  variant = "legend",
  ...props
}: ComponentProps<"legend"> & { variant?: FieldLegendVariant }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(fieldLegend({ variant }), className)}
      {...props}
    />
  );
}

export function FieldGroup({ className, size = "default", ...props }: ComponentProps<"div"> & { size?: FieldSize }) {
  return <div data-slot="field-group" data-size={size} className={cn(field({ size }).group(), className)} {...props} />;
}

export function Field({
  className,
  orientation = "vertical",
  size = "default",
  ...props
}: ComponentProps<"div"> & { orientation?: FieldOrientation; size?: FieldSize }) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: shadcn's markup; a fieldset would add a border and legend semantics
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      data-size={size}
      className={cn(field({ orientation, size }).root(), className)}
      {...props}
    />
  );
}

export function FieldContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="field-content" className={cn(s.content(), className)} {...props} />;
}

export function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={cn(s.label(), className)} {...props} />;
}

export function FieldTitle({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="field-label" className={cn(s.title(), className)} {...props} />;
}

export function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="field-description" className={cn(s.description(), className)} {...props} />;
}

export function FieldSeparator({ children, className, ...props }: ComponentProps<"div"> & { children?: ReactNode }) {
  return (
    <div
      data-slot="field-separator"
      data-content={Boolean(children)}
      className={cn(s.separator(), className)}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children ? (
        <span data-slot="field-separator-content" className={s.separatorContent()}>
          {children}
        </span>
      ) : null}
    </div>
  );
}

export function FieldError({
  className,
  children,
  errors,
  ...props
}: ComponentProps<"div"> & { errors?: FieldErrorEntry[] }) {
  const messages = fieldErrorMessages(errors);
  if (!children && !messages.length) return null;
  return (
    <div role="alert" data-slot="field-error" className={cn(s.error(), className)} {...props}>
      {children ??
        (messages.length === 1 ? (
          messages[0]
        ) : (
          <ul className="ml-4 flex list-disc flex-col gap-1">
            {messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ))}
    </div>
  );
}

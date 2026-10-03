import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "@/lib/cn";
import { type InputSize, input } from "./variants";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function Input({ className, size = "md", invalid = false, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      aria-invalid={invalid || rest["aria-invalid"] || undefined}
      className={cn(input({ size }), className)}
    />
  );
}

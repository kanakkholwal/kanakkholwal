"use client";

import { type ComponentProps, createContext, useContext, useMemo } from "react";
import { cn } from "@/lib/cn";
import { type TableDensity, type TableVariant, table } from "./variants";

const TableContext = createContext<{ variant: TableVariant; density: TableDensity }>({
  variant: "default",
  density: "comfortable",
});

export interface TableProps extends ComponentProps<"table"> {
  variant?: TableVariant;
  density?: TableDensity;
  containerClassName?: string;
}

export function Table({
  variant = "default",
  density = "comfortable",
  className,
  containerClassName,
  ...props
}: TableProps) {
  const { container, root } = table({ variant, density });
  const style = useMemo(() => ({ variant, density }), [variant, density]);
  return (
    <TableContext.Provider value={style}>
      <div data-slot="table-container" className={cn(container(), containerClassName)}>
        <table data-slot="table" className={cn(root(), className)} {...props} />
      </div>
    </TableContext.Provider>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  const { header } = table(useContext(TableContext));
  return <thead data-slot="table-header" className={cn(header(), className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  const { body } = table(useContext(TableContext));
  return <tbody data-slot="table-body" className={cn(body(), className)} {...props} />;
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  const { footer } = table(useContext(TableContext));
  return <tfoot data-slot="table-footer" className={cn(footer(), className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  const { row } = table(useContext(TableContext));
  return <tr data-slot="table-row" className={cn(row(), className)} {...props} />;
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  const { head } = table(useContext(TableContext));
  return <th data-slot="table-head" className={cn(head(), className)} {...props} />;
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  const { cell } = table(useContext(TableContext));
  return <td data-slot="table-cell" className={cn(cell(), className)} {...props} />;
}

export function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  const { caption } = table(useContext(TableContext));
  return <caption data-slot="table-caption" className={cn(caption(), className)} {...props} />;
}

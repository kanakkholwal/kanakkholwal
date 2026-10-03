import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/cn";

export type RankedItem = { label: string; value: number };

const number = new Intl.NumberFormat("en-US");

/** Quiet ranked rows: label left, mono count right, a faint bar for the share. */
export function RankedTable({
  title,
  unit,
  items,
  empty = "Nothing yet",
  className,
}: {
  title: string;
  unit: string;
  items: RankedItem[];
  empty?: string;
  className?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <Table
      density="compact"
      containerClassName="overflow-visible rounded-none border-0"
      className={cn("table-fixed", className)}
    >
      <TableHeader className="bg-transparent">
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-2 pb-2 font-normal text-xs">{title}</TableHead>
          <TableHead className="w-20 px-2 pb-2 text-right font-normal text-xs">{unit}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length ? (
          items.map((item) => (
            <TableRow key={item.label} className="border-0 hover:bg-transparent">
              <TableCell className="relative px-2 py-1.5">
                <span
                  aria-hidden
                  className="absolute inset-y-0.5 left-0 rounded-md bg-foreground/[0.04]"
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
                <span className="relative block truncate" title={item.label}>
                  {item.label}
                </span>
              </TableCell>
              <TableCell className="px-2 py-1.5 text-right font-mono text-muted-foreground text-xs tabular-nums">
                {number.format(item.value)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="border-0 hover:bg-transparent">
            <TableCell colSpan={2} className="px-2 py-3 text-muted-foreground text-sm">
              {empty}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

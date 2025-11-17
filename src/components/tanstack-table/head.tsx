import { flexRender } from "@tanstack/react-table";
import type { Table } from "@tanstack/react-table";
import { ChevronsUpDown, ChevronsDown, ChevronsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableHeader, TableHead, TableRow } from "@/components/ui/table";
import type { TableHeadStyles } from "@/widgets/AppsmithTable/types/style.types";

interface HeadProps<TData> {
  table: Table<TData>;
  styles?: TableHeadStyles;
}

const TanstackTableHead = <TData,>({ table, styles }: HeadProps<TData>) => {
  return (
    <TableHeader className={styles?.body}>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className={styles?.row}>
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              colSpan={header.colSpan}
              className={cn(
                "whitespace-normal break-words text-center select-none p-1 text-xs xs:text-sm lg:text-start min-w-8 lg:text-base lg:font-semibold lg:px-2",
                header.column.getCanSort() && "cursor-pointer",
                styles?.cell
              )}
              onClick={header.column.getToggleSortingHandler()}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {{
                asc: header.column.getCanSort() && (
                  <ChevronsDown
                    className={cn(
                      "text-foreground hidden size-4 sm:inline-block",
                      styles?.icon
                    )}
                  />
                ),
                desc: header.column.getCanSort() && (
                  <ChevronsUp
                    className={cn(
                      "text-foreground hidden size-4 sm:inline-block",
                      styles?.icon
                    )}
                  />
                ),
              }[header.column.getIsSorted() as "asc" | "desc"] ??
                (header.column.getCanSort() && (
                  <ChevronsUpDown
                    className={cn(
                      "text-foreground hidden size-4 sm:inline-block",
                      styles?.icon
                    )}
                  />
                ))}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
};
export default TanstackTableHead;

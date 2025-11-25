import { cn } from "@/lib/utils";
import { TableBody, TableRow, TableCell } from "../ui/table";
import type { Table, RowData } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import type { TableBodyStyles } from "@/types/index";
import { ItemSize } from "@/constants";
import {
  getCommonPinningStyles,
  getCommonPinningClasses,
  sizeClasses,
} from "./styles";
import { type AppsmithColumnMeta } from "@/types/index";

type BodyProps<TData extends RowData> = {
  table: Table<TData>;
  styles?: TableBodyStyles;
};

function TanstackTableBody<TData extends RowData>({
  table,
  styles,
}: BodyProps<TData>) {
  return (
    <TableBody className={styles?.body}>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          className={cn("even:bg-foreground/5", styles?.row)}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              className={cn(
                "whitespace-normal break-words border text-center lg:text-start max-w-96",
                getCommonPinningClasses(cell.column),
                sizeClasses[
                  (cell.column.columnDef.meta as AppsmithColumnMeta)?.size ||
                    ItemSize.md
                ],
                styles?.cell
              )}
              style={getCommonPinningStyles(cell.column)}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

export default TanstackTableBody;

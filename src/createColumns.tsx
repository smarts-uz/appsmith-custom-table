import type { ColumnDef } from "@tanstack/react-table";
import { ActionCell } from "./components/tanstack-table/action-cell";
import { ItemSize } from "./constants";
import { TableModelSchema, type AppsmithColumnMeta } from "./types";
import type z from "zod";
import TableBodyCell from "./components/tanstack-table/body-cell";

const CreateColumns = TableModelSchema.omit({
  rowSelectionAction: true,
  updateModel: true,
  tableData: true,
  limit: true,
  max_count: true,
  styles: true,
  onModelChange: true,
});

type CreateColumnsProps = z.infer<typeof CreateColumns>;

export function createColumns<TData>({
  schema,
  indexColumn,
  rowActions = [],
  actionColumn,
  locale,
  triggerEvent,
}: CreateColumnsProps): ColumnDef<TData>[] {
  const indexColumns: ColumnDef<TData>[] = [];
  if (indexColumn?.enable) {
    indexColumns.push({
      id: "index",
      header: "№",
      meta: {
        size: ItemSize.xs,
      },
      cell: ({ row }) => row.index + 1,
    });
  }

  const autoCols = Object.entries(schema)
    .map(([colKey, colSchema]) => {
      const { size = ItemSize.md, title } = colSchema;
      const headerText = title
        ? title[locale]
        : colKey[0].toUpperCase() + colKey.slice(1);

      const colDef: ColumnDef<TData> = {
        accessorKey: colKey,
        header: headerText,
        meta: {
          headerText,
          size,
        } as AppsmithColumnMeta,
        cell: (info) => (
          <TableBodyCell
            value={info.getValue()}
            type={colSchema.type || "text"}
            triggerEvent={triggerEvent}
          />
        ),
      };

      return colDef;
    })
    .filter(Boolean) as ColumnDef<TData>[];

  const actionColumns: ColumnDef<TData>[] = [];
  if (actionColumn?.enable && rowActions.length > 0) {
    actionColumns.push({
      id: "actions",
      header: "",
      meta: {
        size: ItemSize.xs,
      },
      cell: ({ row }) => (
        <ActionCell
          type={actionColumn.type}
          triggerEvent={triggerEvent}
          row={row}
          rowActions={rowActions}
        />
      ),
    });
  }

  return [...indexColumns, ...autoCols, ...actionColumns];
}

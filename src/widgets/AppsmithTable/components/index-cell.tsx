import type { Row, Table } from "@tanstack/react-table";

type IndexCellProps<TData> = {
  row: Row<TData>;
  table: Table<TData>;
  enablePagination?: boolean;
};

const IndexCell = <TData,>({
  row,
  table,
  enablePagination = true,
}: IndexCellProps<TData>) => {
  const { pageIndex, pageSize } = table.getState().pagination;
  const index = enablePagination
    ? pageIndex * pageSize + row.index + 1
    : row.index + 1;

  return <div className="text-center">{index}</div>;
};
export default IndexCell;

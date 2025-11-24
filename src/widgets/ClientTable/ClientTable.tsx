import React from "react";
import { useInView } from "react-intersection-observer";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import TanstackTableBody from "@/components/tanstack-table/body";
import TanstackTableHead from "@/components/tanstack-table/head";
import { createColumns } from "./createColumns";
import type { TableModel } from "./types";
import { PinDirection } from "./constants";
import { validateTableModel } from "./validator/validateTableModal";
import { Table } from "@/components/ui/table";
import { InfoCard } from "./components/info-card";
import { cn } from "@/lib/utils";
import { PER_PAGE } from "./constants";
import { Loader } from "lucide-react";

function ClientTable(props: TableModel) {
  const {
    schema,
    rowActions,
    rowSelectionAction,
    actionColumn,
    indexRow,
    data,
    styles,
    limit = PER_PAGE,
    updateModel = () => {},
    triggerEvent = () => {},
  } = props;

  const validation = validateTableModel(props);
  const [rowSelection, setRowSelection] = React.useState({});
  const [rowPinning, setRowPinning] = React.useState({});
  const [page, setPage] = React.useState(1);
  const [hasMore] = React.useState(true);
  const isLoadingRef = React.useRef(false);
  console.log(page);
  const [sorting] = React.useState([]);

  const getInitialPinning = React.useCallback(() => {
    const left: string[] = [];
    const right: string[] = [];

    if (indexRow?.enable) {
      if (indexRow?.pin === PinDirection.left) left.push("#");
      else if (indexRow?.pin === PinDirection.right) right.push("#");
    }

    if (actionColumn?.enable && rowActions && rowActions?.length > 0) {
      if (actionColumn?.pin === PinDirection.left) left.push("actions");
      else if (actionColumn?.pin === PinDirection.right) right.push("actions");
    }

    return { left, right };
  }, [indexRow, actionColumn, rowActions]);

  const [columnPinning, setColumnPinning] = React.useState(getInitialPinning());

  React.useEffect(() => {
    setColumnPinning(getInitialPinning());
  }, [getInitialPinning]);

  const columns = createColumns({
    schema,
    rowActions,
    indexRow,
    actionColumn,
    triggerEvent,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onRowPinningChange: setRowPinning,
    state: {
      sorting,
      rowSelection,
      columnPinning,
      rowPinning,
    },
    enableRowSelection: true,
    manualSorting: true,
  });

  // Handle row selection
  React.useEffect(() => {
    const selectedRowId = Object.keys(rowSelection)[0];

    if (!selectedRowId) {
      updateModel({ selectedRow: {} });
      return;
    }

    const selectedRow = table.getRow(selectedRowId);
    if (selectedRow) {
      updateModel({ selectedRow: selectedRow.original });
      if (rowSelectionAction) {
        triggerEvent(rowSelectionAction, {
          row: selectedRow.original,
        });
      }
    }
  }, [rowSelection, rowSelectionAction, table]);

  // IntersectionObserver hook
  const { ref: loaderRef, inView } = useInView({
    threshold: 1,
    triggerOnce: false,
  });

  // Trigger loading next page when sentinel comes into view
  React.useEffect(() => {
    if (inView && hasMore && !isLoadingRef.current) {
      isLoadingRef.current = true;
      setPage((prev) => {
        const next = prev + 1;
        triggerEvent("onLoadMore", { page: next, limit });
        return next;
      });
    }
  }, [inView, hasMore, triggerEvent, limit]);

  // Update hasMore flag based on returned data
  // React.useEffect(() => {
  //   if (data.length < page * limit) {
  //     setHasMore(false);
  //   }
  // }, [data, page, limit]);
  React.useEffect(() => {
    isLoadingRef.current = false;
  }, [data]);

  if (data?.length === 0) {
    return <InfoCard message={"noData"} variant="info" />;
  }

  if (!validation.success) {
    return (
      <InfoCard
        message={
          typeof validation.error === "string"
            ? validation.error
            : "Table configuration is invalid. Check the errors above."
        }
        variant="error"
      />
    );
  }

  return (
    <main
      className={cn(
        "max-h-svh lg:max-h-[40rem] border-border xl:max-h-[48rem] relative flex flex-col gap-2 overflow-y-auto",
        styles?.container
      )}
      style={{ ...styles?.variables }}
    >
      <Table
        className={cn(
          "w-full min-w-96 table-auto border-collapse",
          styles?.table
        )}
      >
        <TanstackTableHead styles={styles?.head} table={table} />
        <TanstackTableBody styles={styles?.body} table={table}>
          {hasMore && (
            <div
              ref={loaderRef}
              className="h-10 flex items-center justify-center text-muted-foreground"
            >
              <Loader className="animate-spin size-4" />
            </div>
          )}
        </TanstackTableBody>
      </Table>
    </main>
  );
}

export default ClientTable;

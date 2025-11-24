import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import TanstackTableBody from "@/components/tanstack-table/body";
import TanstackTableHead from "@/components/tanstack-table/head";
import { createColumns } from "./createColumns";
import { getT } from "./lib/getT";
import { defaultTranslations } from "./lib/translations";
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
    translations,
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
  const [hasMore, setHasMore] = React.useState(true);

  const loaderRef = React.useRef<HTMLDivElement>(null);
  const isLoadingRef = React.useRef(false);

  const t = React.useCallback(getT(translations, defaultTranslations), [
    translations,
  ]);

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

  // Infinite scroll using IntersectionObserver
  React.useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoadingRef.current) {
          isLoadingRef.current = true;
          setPage((prev) => {
            const next = prev + 1;
            triggerEvent("onLoadMore", { page: next, limit });
            return next;
          });
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, triggerEvent, limit]);

  // Reset loading state and determine if more data exists
  React.useEffect(() => {
    isLoadingRef.current = false;

    // If last page fetched fewer rows than expected, stop further loading
    if (data.length < page * limit) {
      setHasMore(false);
    }
  }, [data, page, limit]);

  if (data?.length === 0) {
    return <InfoCard message={t("noData")} variant="info" />;
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
        "max-h-svh lg:max-h-[40rem] border-border xl:max-h-[48rem] relative flex flex-col gap-2",
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
        <TanstackTableBody styles={styles?.body} table={table} />
      </Table>

      {/* Sentinel element for IntersectionObserver */}
      {hasMore && (
        <div ref={loaderRef} className="h-8 flex items-center justify-center ">
          <Loader className="animate-spin text-muted-foreground" />
        </div>
      )}
    </main>
  );
}

export default ClientTable;

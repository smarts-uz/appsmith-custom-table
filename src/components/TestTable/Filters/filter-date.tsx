import { isEmpty } from "lodash";
import { Input } from "@/components/ui/input";
import type { Column } from "@tanstack/react-table";

export type DateFilterValue = {
  from?: string;
  to?: string;
};

type TableFilterDateProps<TData> = {
  column: Column<TData, DateFilterValue | undefined>;
  columnFilterValue: DateFilterValue | undefined;
  filterId: string;
  headerText: string;
  t: (key: string, opts?: Record<string, any>) => string;
};

export function TableFilterDate<TData>({
  column,
  columnFilterValue,
  filterId,
  headerText,
  t,
}: TableFilterDateProps<TData>) {
  const fromId = `${filterId}-from`;
  const toId = `${filterId}-to`;

  const fromValue = columnFilterValue?.from ?? "";
  const toValue = columnFilterValue?.to ?? "";

  const setFrom = (value: string) => {
    column.setFilterValue((old: any) => ({
      ...(typeof old === "object" && old !== null ? old : {}),
      from: isEmpty(value) ? undefined : value,
    }));
  };

  const setTo = (value: string) => {
    column.setFilterValue((old: any) => ({
      ...(typeof old === "object" && old !== null ? old : {}),
      to: isEmpty(value) ? undefined : value,
    }));
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        id={fromId}
        type="date"
        value={fromValue}
        onChange={(e) => setFrom(e.target.value)}
        aria-label={t("dateFromAriaLabel", { headerText })}
        className="w-full max-w-xs"
      />
      <span>-</span>
      <Input
        id={toId}
        type="date"
        value={toValue}
        onChange={(e) => setTo(e.target.value)}
        aria-label={t("dateToAriaLabel", { headerText })}
        className="w-full max-w-xs"
      />
    </div>
  );
}

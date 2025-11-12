import { isEmpty } from "lodash";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Column } from "@tanstack/react-table";

type NumberFilterValue = {
  min?: number;
  max?: number;
};

type TableFilterNumberProps<TData> = {
  column: Column<TData, NumberFilterValue | undefined>;
  columnFilterValue: NumberFilterValue | undefined;
  filterId: string;
  headerText: string;
  t: (key: string, opts?: Record<string, any>) => string;
};

export function TableFilterNumber<TData>({
  column,
  columnFilterValue,
  filterId,
  headerText,
  t,
}: TableFilterNumberProps<TData>) {
  const minId = `${filterId}-min`;
  const maxId = `${filterId}-max`;
  // @ts-expect-error: minOptions and maxOptions are potentially injected via meta at runtime
  const minOptions = column.columnDef.meta?.minOptions ?? [];
  // @ts-expect-error: minOptions and maxOptions are potentially injected via meta at runtime
  const maxOptions = column.columnDef.meta?.maxOptions ?? [];

  const handleMinChange = (value: string) => {
    column.setFilterValue((old = {}) => ({
      ...old,
      min: isEmpty(value) ? undefined : Number(value),
    }));
  };

  const handleMaxChange = (value: string) => {
    column.setFilterValue((old = {}) => ({
      ...old,
      max: isEmpty(value) ? undefined : Number(value),
    }));
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={
          isEmpty(columnFilterValue?.min)
            ? ""
            : String(columnFilterValue?.min ?? "")
        }
        onValueChange={handleMinChange}
      >
        <SelectTrigger
          id={minId}
          aria-label={t("numberMinAriaLabel", { headerText })}
          className="w-full max-w-xs"
        >
          <SelectValue placeholder={t("min")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">{t("all")}</SelectItem>
          {minOptions.map((item: number, index: number) => (
            <SelectItem key={index} value={String(item)}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span>-</span>

      <Select
        value={
          isEmpty(columnFilterValue?.max)
            ? ""
            : String(columnFilterValue?.max ?? "")
        }
        onValueChange={handleMaxChange}
      >
        <SelectTrigger
          id={maxId}
          aria-label={t("numberMaxAriaLabel", { headerText })}
          className="w-full max-w-xs"
        >
          <SelectValue placeholder={t("max")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">{t("all")}</SelectItem>
          {maxOptions.map((item: number, index: number) => (
            <SelectItem key={index} value={String(item)}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

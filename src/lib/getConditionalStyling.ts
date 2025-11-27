import type { ConditionalRowStyle } from "@/types";
import type { Row, RowData } from "@tanstack/react-table";

type Primitive = string | number | boolean | null | undefined;

const isNumber = (v: unknown): v is number => typeof v === "number";
const isString = (v: unknown): v is string => typeof v === "string";

export const getConditionalRowClassName = <TData extends RowData>({
  row,
  conditionalRowStyles,
}: {
  row: Row<TData>;
  conditionalRowStyles?: ConditionalRowStyle[];
}): string => {
  if (!conditionalRowStyles?.length) return "";

  const rowData = row.original;

  const operators: Record<
    string,
    (cell: Primitive, value?: Primitive) => boolean
  > = {
    ">": (c, v) => isNumber(c) && isNumber(v) && c > v,
    "<": (c, v) => isNumber(c) && isNumber(v) && c < v,
    ">=": (c, v) => isNumber(c) && isNumber(v) && c >= v,
    "<=": (c, v) => isNumber(c) && isNumber(v) && c <= v,
    "===": (c, v) => c === v,
    "==": (c, v) => c == v,
    "!==": (c, v) => c !== v,
    "!=": (c, v) => c != v,
    contains: (c, v) =>
      isString(c) && isString(v) && c.toLowerCase().includes(v.toLowerCase()),
    startsWith: (c, v) =>
      isString(c) && isString(v) && c.toLowerCase().startsWith(v.toLowerCase()),
    endsWith: (c, v) =>
      isString(c) && isString(v) && c.toLowerCase().endsWith(v.toLowerCase()),
    isEmpty: (c) => c === null || c === undefined || c === "",
    isNotEmpty: (c) => c !== null && c !== undefined && c !== "",
  };

  let classNames = "";

  for (const rule of conditionalRowStyles) {
    const { column, operator, value, className } = rule;
    if (!column || !operator || !className) continue;

    const cellValue = rowData[column as keyof TData] as Primitive;
    let comparisonValue: Primitive;

    if (value && typeof value === "object" && "columnRef" in value) {
      comparisonValue = rowData[value.columnRef as keyof TData] as Primitive;
    } else {
      comparisonValue = value as Primitive;
    }

    const opFn = operators[operator];
    if (opFn?.(cellValue, comparisonValue)) {
      classNames += className + " ";
    }
  }

  return classNames.trim();
};

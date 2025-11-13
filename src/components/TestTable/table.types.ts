import type { ColumnType } from "@/types/schema";

export type RowAction<TData> = {
  title: string;
  onClick: (rowData: TData) => void;
};

export enum ItemSize {
  "xs" = "xs",
  "sm" = "sm",
  "md" = "md",
  "lg" = "lg",
}

export enum PinDirection {
  left = "left",
  right = "right",
}

export type ColumnSchemaItem = {
  type: ColumnType;
  options?: { value: string; title: string }[];
  sort?: boolean;
  filter?: boolean;
  pin?: PinDirection | null;
  size?: ItemSize;
  textAlign?: "left" | "center" | "right";
  title?: string;
  dateFormat?: string;
  minOptions?: number[];
  maxOptions?: number[];
};

type IndexRow = {
  enable: boolean;
  size: ItemSize;
  pin: PinDirection | null;
};

export type ColumnParams<TData> = {
  data: TData[];
  schema: Record<string, ColumnSchemaItem>;
  indexRow: IndexRow;
  enableRowPinning?: boolean;
  rowActions?: RowAction<TData>[];
  actionSize?: ItemSize;
  actionPin?: PinDirection | null;
  t: (key: string) => string;
  openDropdownRowId?: string | null;
  setOpenDropdownRowId?: (id: string | null) => void;
};

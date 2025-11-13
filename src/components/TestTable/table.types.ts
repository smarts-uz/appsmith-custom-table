import type { ColumnType } from "@/types/schema";

export type RowAction = {
  title: string;
  onClick: string;
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

export enum HTTP_METHODS {
  "GET" = "GET",
  "POST" = "POST",
  "PUT" = "PUT",
  "DELETE" = "DELETE",
  "PATCH" = "PATCH",
}

type Fetcher = {
  url: string;
  method: HTTP_METHODS;
  headers?: Record<string, string>;
  body?: BodyInit | null;
  accessor?: string;
};

export type ColumnParams<TData> = {
  data: TData[];
  schema: Record<string, ColumnSchemaItem>;
  indexRow?: IndexRow;
  rowActions?: RowAction[];
  actionColumn?: ActionColumn;
};

type ActionColumn = {
  enable: boolean;
  pin: PinDirection | null;
  size: ItemSize;
};

export type TableModel = {
  fetcher: Fetcher;
  schema: Record<string, ColumnSchemaItem>;
  indexRow?: IndexRow;
  rowActions?: RowAction[];
  rowSelectionAction?: string;
  actionColumn?: ActionColumn;
  translations?: Record<string, string>;
};

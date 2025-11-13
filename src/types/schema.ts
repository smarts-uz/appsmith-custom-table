import type { ItemSize } from "@/components/TestTable/table.types";

// Allowed column data types
export enum ColumnType {
  TEXT = "text",
  NUMBER = "number",
  ENUM = "enum",
  BOOL = "bool",
  ID = "id",
  DATE = "date",
  CURRENCY = "currency",
  PHONE = "phone",
}

// Individual column schema
export interface ColumnSchema {
  type: ColumnType;
  title?: string;
  sort?: boolean;
  filter?: boolean;
  size?: ItemSize;
}

export type TableSchema = Record<string, ColumnSchema>;

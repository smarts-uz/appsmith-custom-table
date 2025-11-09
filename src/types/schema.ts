// Allowed column data types
export type ColumnType = "id" | "text" | "phone" | "date" | "number" | "bool";

// Optional size for some columns
export type ColumnSize = "sm" | "md" | "lg";

// Individual column schema
export interface ColumnSchema {
  type: ColumnType;
  title: string;
  sort?: boolean;
  filter?: boolean;
  size?: ColumnSize;
}

export type TableSchema = Record<string, ColumnSchema>;

import z from "zod";
import { ItemSize, PER_PAGE, PinDirection } from "../constants";
import * as LucideIcons from "lucide-react";
import { RowStyleOperator } from "../constants";

export const ColumnItemType = z.enum([
  "text",
  "url",
  "phone",
  "date",
  "datetime",
  "currency",
]);

const ColumnItemSchema = z.object({
  type: ColumnItemType.default("text").optional(),
  size: z.enum(ItemSize).optional(),
  title: z
    .record(
      z.string({ error: "An incorrect schema title is provided" }),
      z.string({ error: "An incorrect schema title body is provided" })
    )
    .optional(),
  className: z.string().optional(),
});

export const IndexColumnSchema = z.object({
  enable: z.boolean(),
  pin: z.enum(PinDirection).default(PinDirection.left).optional(),
  className: z.string().optional(),
});

export type LucideIconName = keyof typeof LucideIcons;

export const RowActionSchema = z.object({
  title: z.record(
    z.string({ error: "An incorrect schema title is provided" }),
    z.string({ error: "An incorrect schema title body is provided" })
  ),
  onClick: z.string(),
  icon: z
    .enum(Object.keys(LucideIcons) as [LucideIconName, ...LucideIconName[]])
    .optional(),
  className: z.string().optional(),
});

export const ActionColumnSchema = z.object({
  enable: z.boolean(),
  actions: z.array(RowActionSchema),
  pin: z.enum(PinDirection).default(PinDirection.right).optional(),
  type: z
    .enum(["default", "destructive", "outline", "secondary", "ghost", "link"])
    .optional(),
  icon: z
    .enum(Object.keys(LucideIcons) as [LucideIconName, ...LucideIconName[]])
    .optional(),
  styles: z
    .object({ trigger: z.string().optional(), content: z.string().optional() })
    .optional(),
});

export const TableSchema = z.record(z.string(), ColumnItemSchema, {
  error: "Schema not provided",
});

const TableSection = z.object({
  body: z.string().optional(),
  row: z.string().optional(),
  cell: z.string().optional(),
});

export const AppsmithTableStyles = z
  .object({
    head: TableSection.optional(),
    body: TableSection.optional(),
    container: z.string().optional(),
    table: z.string().optional(),
    variables: z.record(z.string(), z.string()).optional(),
  })
  .optional();

export const TriggerEventSchema = z.function({
  input: [
    z.string(),
    z.object({
      row: z.any().optional(),
      page: z.number().optional(),
      limit: z.number().optional(),
      url: z.url().optional(),
    }),
  ],
});

export const UpdateModelSchema = z.function({
  input: [z.any()],
});

export const OnModelChangeSchema = z.function({
  input: [z.any()],
});

const ConditionalRowStyleSchema = z.object({
  column: z.string(),
  operator: z.enum(RowStyleOperator),
  value: z.union([
    z.string(),
    z.number(),
    z.undefined(),
    z.boolean(),
    z.object({ columnRef: z.string() }),
  ]),
  className: z.string(),
});

export const TableModelSchema = z.object({
  tableData: z.array(z.any()).default([]),
  limit: z.number().default(PER_PAGE).optional(),
  max_count: z.number().default(PER_PAGE).optional(),
  schema: TableSchema,
  rowSelectionAction: z.string().optional(),
  indexColumn: IndexColumnSchema.optional(),
  actionColumn: ActionColumnSchema.optional(),
  conditionalRowStyles: z.array(ConditionalRowStyleSchema).optional(),
  locale: z.string(),
  styles: AppsmithTableStyles,
  triggerEvent: TriggerEventSchema,
  updateModel: UpdateModelSchema,
  onModelChange: OnModelChangeSchema,
});

export interface AppsmithColumnMeta {
  headerText: string;
  size: ItemSize;
}

export type ColumnItem = z.infer<typeof ColumnItemSchema>;
export type TableModel = z.infer<typeof TableModelSchema>;
export type IndexColumn = z.infer<typeof IndexColumnSchema>;
export type ActionColumn = z.infer<typeof ActionColumnSchema>;
export type RowAction = z.infer<typeof RowActionSchema>;
export type Schema = z.infer<typeof TableSchema>;
export type TableSectionStyles = z.infer<typeof TableSection>;
export type AppsmithTableStyles = z.infer<typeof AppsmithTableStyles>;
export type TriggerEvent = z.infer<typeof TriggerEventSchema>;
export type UpdateModel = z.infer<typeof UpdateModelSchema>;
export type ColumnType = z.infer<typeof ColumnItemType>;
export type ConditionalRowStyle = z.infer<typeof ConditionalRowStyleSchema>;

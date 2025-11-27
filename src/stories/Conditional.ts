import "../tailwind.css";
import type { RowAction, TableModel } from "../types";
import { PinDirection, RowStyleOperator } from "../constants";
import { generateData, mockSchema } from "./helper";

const postsRowActions: RowAction[] = [
  { title: "Korish", onClick: "onClick", icon: "Activity" },
  { title: "Qoshish", onClick: "onKomol", icon: "AlarmClockPlus" },
  { title: "Tolov", onClick: "onClick" },
];

export const ConditionalTableProps: TableModel = {
  tableData: generateData(20),
  limit: 20,
  max_count: 400,
  schema: mockSchema,
  rowActions: postsRowActions,
  actionColumn: { enable: true, pin: PinDirection.right, type: "outline" },
  indexColumn: { enable: true },
  conditionalRowStyles: [
    {
      column: "used_days",
      operator: RowStyleOperator.GTE,
      value: 300,
      className: "even:bg-red-400 odd:bg-red-400",
    },
    {
      column: "used_days",
      operator: RowStyleOperator.GTE,
      value: 200,
      className: "even:bg-yellow-400 odd:bg-yellow-400",
    },
    {
      column: "used_days",
      operator: RowStyleOperator.GTE,
      value: 100,
      className: "even:bg-blue-400 odd:bg-blue-400",
    },
  ],
};

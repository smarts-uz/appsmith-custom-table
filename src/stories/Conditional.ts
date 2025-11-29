import "../tailwind.css";
import type { RowAction, TableModel } from "../types";
import { PinDirection, RowStyleOperator } from "../constants";
import { generateData, mockSchema } from "./helper";

const postsRowActions: RowAction[] = [
  {
    title: { uz: "Korish", ru: "Кориши" },
    onClick: "onClick",
    icon: "Activity",
  },
  {
    title: { uz: "Qoshish", ru: "Кошиши" },
    onClick: "onKomol",
    icon: "AlarmClockPlus",
  },
  { title: { uz: "Tolov", ru: "Толов" }, onClick: "onClick" },
];

export const ConditionalTableProps: TableModel = {
  locale: "uz",
  tableData: generateData(20),
  schema: mockSchema,
  actionColumn: {
    enable: true,
    pin: PinDirection.right,
    type: "outline",
    actions: postsRowActions,
  },
  indexColumn: { enable: true },
  conditionalRowStyles: [
    {
      column: "used_days",
      operator: RowStyleOperator.GTE,
      value: 150,
      className: "even:bg-blue-400 odd:bg-blue-400",
    },
    {
      column: "used_days",
      operator: RowStyleOperator.GTE,
      value: 300,
      className: "even:bg-red-400 odd:bg-red-400",
    },
    {
      column: "total_payment_amount",
      operator: RowStyleOperator.LT,
      value: { columnRef: "debt_amount" },
      className: "even:text-red-800 odd:text-red-800 font-bold",
    },
    {
      column: "total_payment_amount",
      operator: RowStyleOperator.GTE,
      value: { columnRef: "debt_amount" },
      className: "even:text-green-800 odd:text-green-800 font-bold",
    },
  ],
  onModelChange: (model) => console.log(model),
  triggerEvent: (event) => console.log(event),
  updateModel: (model) => console.log(model),
};

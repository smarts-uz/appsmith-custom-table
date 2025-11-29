import "../tailwind.css";
import type { RowAction, TableModel } from "../types";
import { PinDirection } from "../constants";
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

export const TranslatedTableProps: TableModel = {
  tableData: generateData(20),
  schema: mockSchema,
  locale: "ru",
  actionColumn: {
    enable: true,
    pin: PinDirection.right,
    type: "outline",
    actions: postsRowActions,
  },
  indexColumn: { enable: true },
  onModelChange: (model) => console.log(model),
  triggerEvent: (event) => console.log(event),
  updateModel: (model) => console.log(model),
};

import "../tailwind.css";
import type { RowAction, TableModel } from "../types";
import { PinDirection } from "../constants";
import { generateData, mockSchema } from "./helper";

const postsRowActions: RowAction[] = [
  {
    title: { uz: "Korish", ru: "Показать" },
    onClick: "onClick",
    icon: "Activity",
  },
  {
    title: { uz: "Qoshish", ru: "Добавить" },
    onClick: "onKomol",
    icon: "AlarmClockPlus",
  },
  { title: { uz: "Tolov", ru: "Показать" }, onClick: "onClick" },
];

export const DefaultTableProps: TableModel = {
  tableData: generateData(20),
  limit: 22,
  schema: mockSchema,
  locale: "ru",
  actionColumn: {
    enable: true,
    pin: PinDirection.right,
    actions: postsRowActions,
    icon: "Smile",
  },
  indexColumn: { enable: true },
  onModelChange: (model) => console.log(model),
  triggerEvent: (event) => console.log(event),
  updateModel: (model) => console.log(model),
};

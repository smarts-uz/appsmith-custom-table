import "../tailwind.css";
import type { RowAction, TableModel } from "../types";
import { PinDirection } from "../constants";
import { generateData, mockSchema } from "./helper";

const postsRowActions: RowAction[] = [
  { title: "Korish", onClick: "onClick", icon: "Activity" },
  { title: "Qoshish", onClick: "onKomol", icon: "AlarmClockPlus" },
  { title: "Tolov", onClick: "onClick" },
];

export const TranslatedTableProps: TableModel = {
  tableData: generateData(20),
  schema: mockSchema,
  locale: "ru",
  rowActions: postsRowActions,
  actionColumn: { enable: true, pin: PinDirection.right, type: "outline" },
  indexColumn: { enable: true },
  onModelChange: (model) => console.log(model),
  triggerEvent: (event) => console.log(event),
  updateModel: (model) => console.log(model),
};

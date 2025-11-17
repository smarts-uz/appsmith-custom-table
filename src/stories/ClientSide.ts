import "../tailwind.css";
import type {
  RowAction,
  Schema,
  TableModel,
} from "../widgets/AppsmithTable/types";
import { ItemSize, ColumnType } from "../widgets/AppsmithTable/constants";
import { PinDirection } from "../widgets/AppsmithTable/constants";

const postsSchema: Schema = {
  userId: {
    type: ColumnType.NUMBER,
    title: "User ID",
    sort: true,
    filter: true,
  },
  id: {
    type: ColumnType.TEXT,
    title: "Post ID",
    sort: true,
    filter: true,
  },
  title: {
    type: ColumnType.TEXT,
    title: "Title",
    sort: true,
    filter: true,
  },
  body: {
    type: ColumnType.TEXT,
    title: "Body",
    sort: false,
    filter: true,
  },
};

const postsRowActions: RowAction[] = [
  { title: "Korish", onClick: "onClick", icon: "Activity" },
  { title: "Qoshish", onClick: "onKomol", icon: "AlarmClockPlus" },
  { title: "Tolov", onClick: "onClick" },
];

export const ClientSideProps: TableModel = {
  fetcher: { url: "https://jsonplaceholder.typicode.com/posts" },
  schema: postsSchema,
  rowActions: postsRowActions,
  actionColumn: { enable: true, pin: PinDirection.right, size: ItemSize.sm },
  indexRow: { enable: true, size: ItemSize.sm },
};

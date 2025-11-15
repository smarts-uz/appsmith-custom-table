import "./tailwind.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import AppsmithTable from "./widgets/AppsmithTable";
import { postsTableSchema } from "./widgets/AppsmithTable/lib/mock.schema";
import { ItemSize, PinDirection } from "./widgets/AppsmithTable/constants";
import React from "react";

const rowActions = [
  {
    title: "💻Korish",
    onClick: "onClick",
  },
  {
    title: "➕Qoshish",
    onClick: "onKomol",
  },
  {
    title: "💵Tolov",
    onClick: "onClick",
  },
  {
    title: "🔃Qaytarilgan mahsulotlar",
    onClick: "onClick",
  },
  {
    title: "🫰Qaytarish",
    onClick: "onClick",
  },
  {
    title: "✏️Tahrirlash",
    onClick: "onClick",
  },
  {
    title: "🏁Tugatish",
    onClick: "onClick",
  },
];

const actionColumn = {
  enable: true,
  pin: PinDirection.right,
  size: ItemSize.sm,
};

export const mockModel = {
  fetcher: {
    url: "https://jsonplaceholder.typicode.com/posts",
  },
  schema: postsTableSchema,
  rowActions,
  actionColumn,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppsmithTable model={mockModel} />
  </StrictMode>
);

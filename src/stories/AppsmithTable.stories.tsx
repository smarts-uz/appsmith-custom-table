import "../tailwind.css";
import type { Meta, StoryObj } from "@storybook/react";
import AppsmithTable from "../widgets/AppsmithTable/AppsmithTable";
import { ClientSideProps } from "./ClientSide";
import { StyledTableProps } from "./StyledTable";

// Storybook meta
const meta: Meta<typeof AppsmithTable> = {
  title: "Client AppsmithTable",
  component: AppsmithTable,
  tags: ["autodocs"],
  parameters: { deepControls: { enabled: false } },
  argTypes: {
    triggerEvent: { action: "triggerEvent" },
    updateModel: { action: "updateModel" },
  },
};

export default meta;
type Story = StoryObj<typeof AppsmithTable>;

// Full story
export const ClientSide: Story = {
  args: {
    ...ClientSideProps,
  },
  render: (args) => <AppsmithTable {...args} />,
};

// Full story
export const ColoredTable: Story = {
  args: {
    ...StyledTableProps,
  },
  render: (args) => <AppsmithTable {...args} />,
};

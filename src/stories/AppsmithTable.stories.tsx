import "../tailwind.css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useEffect } from "react";
import ClientTable from "../widgets/ClientTable/ClientTable";
import { ClientSideProps, generateData } from "./ClientSide";
import { StyledTableProps } from "./StyledTable";

// Storybook meta
const meta: Meta<typeof ClientTable> = {
  title: "Appsmith Table",
  component: ClientTable,
  tags: ["autodocs"],
  parameters: { deepControls: { enabled: false } },
  argTypes: {
    triggerEvent: { action: "triggerEvent" },
    updateModel: { action: "updateModel" },
  },
};

export default meta;
type Story = StoryObj<typeof ClientTable>;

// Full story
export const ClientSide: Story = {
  args: {
    ...ClientSideProps,
  },
  render: function Render(args) {
    const [data, setData] = useState(args.data);

    useEffect(() => {
      setData(args.data);
    }, [args.data]);

    const onTriggerEvent = (event: string, payload: any) => {
      if (event === "onLoadMore") {
        const newData = generateData(payload.limit || 10);
        setData((prev) => [...(prev || []), ...newData]);
      }
      args.triggerEvent?.(event, payload);
    };

    return <ClientTable {...args} data={data} triggerEvent={onTriggerEvent} />;
  },
};

// Full story
export const ColoredTable: Story = {
  args: {
    ...StyledTableProps,
  },
  render: (args) => <ClientTable {...args} />,
};

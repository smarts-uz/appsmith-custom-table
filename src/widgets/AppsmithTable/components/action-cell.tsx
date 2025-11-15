import { Button } from "@/components/ui/button";
import type { RowAction, TriggerEvent } from "../types";
import type { Row, Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type ActionCellProps<TData> = {
  row: Row<TData>;
  table?: Table<TData>; // optional if needed
  rowActions: RowAction[];
  triggerEvent: TriggerEvent;
};

export const ActionCell = <TData,>({
  row,
  rowActions,
  triggerEvent,
}: ActionCellProps<TData>) => {
  const handleAction = (
    e: React.MouseEvent<HTMLDivElement>,
    eventName: string
  ) => {
    e.stopPropagation();
    triggerEvent(eventName, { row: row.original });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full h-full">
          <span className="icon icon-circle-ellipsis" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {rowActions.map((action, i) => (
          <DropdownMenuItem
            key={i}
            onClick={(e) => handleAction(e, action.onClick)}
          >
            {action.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

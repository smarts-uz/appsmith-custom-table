import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const IndexCell = ({
  row,
  table,
  enablePagination,
}: {
  row: any;
  table: any;
  enablePagination?: boolean;
}) => {
  const { pageIndex, pageSize } = table.getState().pagination;
  const index = enablePagination
    ? pageIndex * pageSize + row.index + 1
    : row.index + 1;
  return <div className="text-center">{index}</div>;
};

export const PinCell = ({
  row,
  t,
}: {
  row: any;
  t: (key: string) => string;
}) => {
  return (
    <div className="flex justify-center gap-1">
      {row.getIsPinned() ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => row.pin(false)}
          title={t("unpinRow")}
        >
          <span className="icon icon-close" />
        </Button>
      ) : (
        <>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => row.pin("top")}
            title={t("pinToTop")}
          >
            <span className="icon icon-arrow-up-thick" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => row.pin("bottom")}
            title={t("pinToBottom")}
          >
            <span className="icon icon-arrow-down-thick" />
          </Button>
        </>
      )}
    </div>
  );
};

export const ActionCell = ({
  row,
  rowActions,
}: {
  row: any;
  rowActions: { title: string; onClick: (row: any) => void }[];
}) => {
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
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(row.original);
            }}
          >
            {action.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface TableCellHoverProps {
  value: unknown;
}

const TableBodyCell: React.FC<TableCellHoverProps> = ({ value }) => {
  const displayValue =
    typeof value === "object" ? JSON.stringify(value) : String(value);

  if (value === null) {
    return <></>;
  }

  return (
    <HoverCard>
      <HoverCardTrigger className="line-clamp-1 text-black">
        {displayValue}
      </HoverCardTrigger>
      <HoverCardContent className="lg:w-80 break-words">
        {displayValue}
      </HoverCardContent>
    </HoverCard>
  );
};
export default TableBodyCell;

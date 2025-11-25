import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRef, useState, useEffect } from "react";

interface TableCellHoverProps {
  value: unknown;
}

const TableBodyCell: React.FC<TableCellHoverProps> = ({ value }) => {
  const displayValue =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  const cellRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = cellRef.current;
    if (el) {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
  }, [displayValue]);

  if (value === null) {
    return <></>;
  }

  const content = (
    <div
      ref={cellRef}
      className="truncate text-center max-w-40 md:max-w-64 lg:max-w-full lg:text-start"
    >
      {displayValue}
    </div>
  );

  return isOverflowing ? (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent className="max-w-64 lg:max-w-80 break-words">
        {displayValue}
      </TooltipContent>
    </Tooltip>
  ) : (
    content
  );
};

export default TableBodyCell;

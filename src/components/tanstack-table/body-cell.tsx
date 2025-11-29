import { useRef, useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type ColumnType, type TriggerEvent } from "@/types";
import { formatUzPhone, formatDate, formatDateTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface TableCellHoverProps {
  value: unknown;
  type: ColumnType;
  triggerEvent: TriggerEvent;
  className?: string;
}

const TableBodyCell: React.FC<TableCellHoverProps> = ({
  value,
  type,
  triggerEvent,
  className,
}) => {
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

  if (
    value === null ||
    value === undefined ||
    (typeof value === "number" && isNaN(+value))
  ) {
    return <></>;
  }

  const content = (
    <div
      ref={cellRef}
      className={cn(
        "truncate text-center max-w-[160px] md:max-w-[256px] lg:max-w-[320px] lg:text-start",
        className
      )}
    >
      {renderCell(displayValue, type, triggerEvent)}
    </div>
  );

  return isOverflowing && type !== "url" ? (
    <Popover>
      <PopoverTrigger
        className="h-min max-w-40 md:max-w-64 lg:max-w-full lg:text-start"
        onClick={(e) => e.stopPropagation()}
        title={displayValue}
      >
        {content}
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        align="center"
        className="w-64 lg:w-80 break-words"
      >
        {displayValue}
      </PopoverContent>
    </Popover>
  ) : (
    content
  );
};

const renderCell = (
  value: unknown,
  type: ColumnType,
  triggerEvent: TriggerEvent
) => {
  switch (type) {
    case "text":
      return String(value);
    case "url":
      const [text, url] = String(value).split("|||");

      return (
        <div
          className="text-primary underline cursor-pointer select-none"
          onClick={(e) => {
            e.stopPropagation();
            if (triggerEvent) {
              triggerEvent("onRedirect", { url });
            }
          }}
        >
          {text}
        </div>
      );
    case "phone":
      return formatUzPhone(String(value));
    case "date":
      return formatDate(value as string);
    case "datetime":
      return formatDateTime(value as string);
    case "currency":
      return Number(value).toLocaleString("uz-UZ");
    default:
      return String(value);
  }
};

export default TableBodyCell;

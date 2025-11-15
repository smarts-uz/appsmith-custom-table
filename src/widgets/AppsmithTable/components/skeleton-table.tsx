import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable({ cols = 5, rows = 20 }) {
  return (
    <Table className="overflow-hidden">
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          {[...Array(cols)].map((_, index) => (
            <TableHead key={index}>
              <Skeleton className="h-5 w-2/3 lg:w-24 xl:w-24" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {[...Array(rows)].map((_, rowIndex) => (
          <TableRow
            key={rowIndex}
            className="border-border hover:bg-transparent"
          >
            {[...Array(cols)].map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-6 w-full md:w-32 lg:w-40" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Application } from "@/app/schemas/types";
import { Button } from "@/components/ui/button";
import { downloadFileImmigration } from "@/lib/data-client";
import { MoreHorizontal } from "lucide-react";

type DurationCategory =
  | "NO"
  | "4D"
  | "3D"
  | "2D"
  | "1D"
  | "8H"
  | "4H"
  | "2H"
  | "1H";

interface TransformedData {
  data: Array<{
    date: string;
    durations: {
      [key in DurationCategory]: {
        count: number;
        averagePrice: number;
        totalAmount: number;
      };
    };
  }>;
  summary: {
    totalPax: number;
    totalAmount: number;
    currency: string;
  };
}

const BillingTable: React.FC<{
  applications: Application[];
  days: number;
}> = ({ applications, days }) => {
  const durationColumns: DurationCategory[] = [
    "NO",
    "4D",
    "3D",
    "2D",
    "1D",
    "8H",
    "4H",
    "2H",
    "1H",
  ];
  const currency = applications[0]?.currency || "USD";

  const transformedData = useMemo(() => {
    const dateDataMap = new Map<
      string,
      {
        counts: Record<DurationCategory, number>;
        amounts: Record<DurationCategory, number>;
      }
    >();

    // Initialize data structure
    applications.forEach((application) => {
      const [datePart] = application.createdDate.split("T");
      const date = application.createdDate ? datePart : "Unknown Date";
      const speed = (application?.speed || "NO") as DurationCategory;
      const price = application.cost || 0;

      if (!dateDataMap.has(date)) {
        dateDataMap.set(date, {
          counts: durationColumns.reduce(
            (acc, col) => ({ ...acc, [col]: 0 }),
            {} as Record<DurationCategory, number>
          ),
          amounts: durationColumns.reduce(
            (acc, col) => ({ ...acc, [col]: 0 }),
            {} as Record<DurationCategory, number>
          ),
        });
      }

      const dateData = dateDataMap.get(date)!;
      dateData.counts[speed]++;
      dateData.amounts[speed] += price;
    });

    // Transform into final format
    const data = Array.from(dateDataMap.entries()).map(([date, dateData]) => ({
      date,
      durations: durationColumns.reduce((acc, duration) => {
        const count = dateData.counts[duration];
        const totalAmount = dateData.amounts[duration];
        return {
          ...acc,
          [duration]: {
            count,
            averagePrice: count > 0 ? totalAmount / count : 0,
            totalAmount,
          },
        };
      }, {} as TransformedData["data"][0]["durations"]),
    }));

    // Calculate summary
    const summary = {
      totalPax: Array.from(dateDataMap.values()).reduce(
        (total, dateData) =>
          total +
          Object.values(dateData.counts).reduce((sum, count) => sum + count, 0),
        0
      ),
      totalAmount: Array.from(dateDataMap.values()).reduce(
        (total, dateData) =>
          total +
          Object.values(dateData.amounts).reduce(
            (sum, amount) => sum + amount,
            0
          ),
        0
      ),
      currency,
    };

    const result: TransformedData = {
      data: data.sort((a, b) => b.date.localeCompare(a.date)),
      summary,
    };

    return result;
  }, [applications, currency, durationColumns]);

  return (
    <Card className="mt-4">
      <CardHeader className="rounded-t-lg border-b bg-secondary mb-0">
        <CardTitle className="flex items-center justify-between mb-0 px-4">
          <div>{days} Days</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  downloadFileImmigration(
                    "xlsx",
                    transformedData,
                    days.toString(),
                    currency
                  );
                }}
              >
                Download .xlsx
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  downloadFileImmigration(
                    "pdf",
                    transformedData,
                    days.toString(),

                    currency
                  );
                }}
              >
                Download Pdf
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  downloadFileImmigration(
                    "csv",
                    transformedData,
                    days.toString(),
                    currency
                  );
                }}
              >
                Download .csv
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">DATE</TableHead>
                {durationColumns.map((col) => (
                  <TableHead key={col} className="text-right">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Avg. Price ({currency})</TableCell>
                {durationColumns.map((col) => (
                  <TableCell key={col} className="text-right text-red-500">
                    {currency}{" "}
                    {transformedData.data[0]?.durations[
                      col
                    ]?.averagePrice.toFixed(2) || "0.00"}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transformedData.data.map((dateData) => (
                <TableRow key={dateData.date}>
                  <TableCell className="font-medium">{dateData.date}</TableCell>
                  {durationColumns.map((col) => (
                    <TableCell key={col} className="text-right">
                      {dateData.durations[col].count}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted">
                <TableCell>Number of pax</TableCell>
                {durationColumns.map((col) => (
                  <TableCell key={col} className="text-right">
                    {transformedData.data.reduce(
                      (sum, dateData) => sum + dateData.durations[col].count,
                      0
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="font-bold">
                <TableCell>Total ({currency})</TableCell>
                {durationColumns.map((col) => (
                  <TableCell key={col} className="text-right">
                    {currency}{" "}
                    {transformedData.data
                      .reduce(
                        (sum, dateData) =>
                          sum + dateData.durations[col].totalAmount,
                        0
                      )
                      .toLocaleString()}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="font-bold">
                  Total (Pax): {transformedData.summary.totalPax} Pax
                </TableCell>
                <TableCell colSpan={5} className="font-bold text-right">
                  Total: {currency}{" "}
                  {transformedData.summary.totalAmount.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingTable;

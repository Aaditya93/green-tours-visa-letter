"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { downloadFile } from "@/lib/data-client";
import { Application } from "@/app/schemas/types";

const getSelectedData = (table: Table<any>) => {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  return selectedRows.length > 0
    ? selectedRows.map((row) => row.original)
    : null;
};

export const columns: ColumnDef<Application>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),

    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <div className="capitalize">{row.getValue("code")}</div>,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "birthday",
    header: "Birthday",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("birthday")}</div>
    ),
  },
  {
    accessorKey: "sex",
    header: "Sex",
    cell: ({ row }) => <div className="capitalize">{row.getValue("sex")}</div>,
  },
  {
    accessorKey: "nationalityCurrent",
    header: "Current Nationality",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nationalityCurrent")}</div>
    ),
  },
  {
    accessorKey: "originalNationality",
    header: "Original Nationality",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("originalNationality")}</div>
    ),
  },
  {
    accessorKey: "job",
    header: "Job",
    cell: ({ row }) => <div className="capitalize">{row.getValue("job")}</div>,
  },
  {
    accessorKey: "workPlace",
    header: "Work Place",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("workPlace")}</div>
    ),
  },
  {
    accessorKey: "passportNumber",
    header: "Passport Number",
    cell: ({ row }) => <div>{row.getValue("passportNumber")}</div>,
  },
  {
    accessorKey: "passportType",
    header: "Passport Type",
    cell: ({ row }) => <div>{row.getValue("passportType")}</div>,
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("purpose")}</div>
    ),
  },
  {
    accessorKey: "fromDate",
    header: "From Date",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("fromDate")}</div>
    ),
  },
  {
    accessorKey: "toDate",
    header: "To Date",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("toDate")}</div>
    ),
  },
  {
    accessorKey: "placeOfIssue",
    header: "Place To Issue",
    filterFn: "equalsString",
    cell: ({ row }) => <div>{row.getValue("placeOfIssue")}</div>,
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("duration")}</div>
    ),
  },
  {
    accessorKey: "speed",
    filterFn: "equalsString",
    header: "Speed",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("speed")}</div>
    ),
  },
  {
    accessorKey: "creator",
    header: "Creator",
    filterFn: "equalsString",
    cell: ({ row }) => <div>{row.getValue("creator")}</div>,
  },
  {
    accessorKey: "handleBy",
    header: "Handle By",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("handleBy")}</div>
    ),
  },
  {
    accessorKey: "createdDate",
    filterFn: "equalsString",
    header: "Created Date",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("createdDate")}</div>
    ),
  },
  {
    accessorKey: "createdTime",
    header: "Created Time",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("createdTime")}</div>
    ),
  },

  {
    accessorKey: "result",
    header: "Result",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("result")}</div>
    ),
  },
  {
    accessorKey: "notes",
    header: "Note",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("notes")}</div>
    ),
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("stage")}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,

    cell: ({ row, table }) => {
      return (
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
                const selectedData = getSelectedData(table);
                downloadFile("xlsx", selectedData || [row.original]);
              }}
            >
              Download .xlsx
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const selectedData = getSelectedData(table);
                downloadFile("pdf", selectedData || [row.original]);
              }}
            >
              Download Pdf
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const selectedData = getSelectedData(table);
                downloadFile("csv", selectedData || [row.original]);
              }}
            >
              Download .csv
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/application/visa/${row.original.id}`}>View</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

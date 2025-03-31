"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo } from "react";

import { Application } from "@/app/schemas/types";

// Create a hook that returns translated columns
export function useColumns() {
  const t = useTranslations("travelAgentDashboard.columns");

  return useMemo<ColumnDef<Application>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label={t("selectAll")}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t("selectRow")}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "code",
        header: t("code"),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("code")}</div>
        ),
      },
      {
        accessorKey: "fullName",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("fullName")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
      },
      {
        accessorKey: "birthday",
        header: t("birthday"),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("birthday")}</div>
        ),
      },
      {
        accessorKey: "sex",
        header: t("sex"),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("sex")}</div>
        ),
      },
      {
        accessorKey: "nationalityCurrent",
        header: t("nationalityCurrent"),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("nationalityCurrent")}</div>
        ),
      },
      {
        accessorKey: "originalNationality",
        header: t("nationalityCurrent"),
        cell: ({ row }) => (
          <div className="capitalize">
            {row.getValue("originalNationality")}
          </div>
        ),
      },
      {
        accessorKey: "job",
        header: t("job"),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("job")}</div>
        ),
      },
      {
        accessorKey: "workPlace",
        header: t("workPlace"),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("workPlace")}</div>
        ),
      },
      {
        accessorKey: "passportNumber",
        header: t("passportNumber"),
        cell: ({ row }) => <div>{row.getValue("passportNumber")}</div>,
      },
      {
        accessorKey: "passportType",
        header: t("passportType"),
        cell: ({ row }) => <div>{row.getValue("passportType")}</div>,
      },
      {
        accessorKey: "purpose",
        header: t("purpose"),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("purpose")}</div>
        ),
      },
      {
        accessorKey: "fromDate",
        header: t("fromDate"),
        filterFn: "equalsString",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("fromDate")}</div>
        ),
      },
      {
        accessorKey: "toDate",
        header: t("toDate"),
        filterFn: "equalsString",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("toDate")}</div>
        ),
      },
      {
        accessorKey: "placeOfIssue",
        header: t("placeOfIssue"),
        filterFn: "equalsString",
        cell: ({ row }) => <div>{row.getValue("placeOfIssue")}</div>,
      },
      {
        accessorKey: "duration",
        header: t("typeOfVisa"),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("duration")}</div>
        ),
      },
      {
        accessorKey: "speed",
        filterFn: "equalsString",
        header: t("speed"),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("speed")}</div>
        ),
      },
      {
        accessorKey: "creator",
        header: t("creator"),
        filterFn: "equalsString",
        cell: ({ row }) => <div>{row.getValue("creator")}</div>,
      },
      {
        accessorKey: "createdDate",
        filterFn: "equalsString",
        header: t("createdDate"),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("createdDate")}</div>
        ),
      },
      {
        accessorKey: "createdTime",
        header: t("createdTime"),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("createdTime")}</div>
        ),
      },
      {
        accessorKey: "travelDuration",
        header: t("travelDuration"),
        cell: ({ row }) => (
          <div className="capitalize">
            {row.getValue("travelDuration")} {t("days")}
          </div>
        ),
      },
      {
        accessorKey: "result",
        header: t("result"),
        cell: ({ row }) => {
          return <div className="capitalize">{row.getValue("result")}</div>;
        },
      },
      {
        accessorKey: "stage",
        header: t("stage"),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("stage")}</div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t("openMenu")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/travel-agent/application/visa/${row.original.id}`}
                  >
                    {t("view")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t]
  );
}

// For backward compatibility if other components are still using the import directly
export const columns = [
  {
    id: "select",
    header: "Select",
    cell: "Select",
    enableSorting: false,
    enableHiding: false,
  },
] as ColumnDef<Application>[];

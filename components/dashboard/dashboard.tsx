"use client";
import { useState } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import AppSidebar from "./app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DataTable from "./data-table";
import { columns } from "./columns";
import { Application } from "@/app/schemas/types";
import { useTranslations } from "next-intl";
import { IApplication, ICreator } from "@/db/models/application";

interface DashboardProps {
  data: IApplication[];
  users: { username: ICreator }[];
}

const Dashboard = ({ users, data }: DashboardProps) => {
  const t = useTranslations("travelAgentDashboard");
  const [searchSelections, setSearchSelections] = useState<string>("fullName");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  return (
    <SidebarProvider>
      <AppSidebar
        users={users}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        searchSelections={searchSelections}
        setSearchSelections={setSearchSelections}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t("title")}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-6 pt-0">
          <DataTable
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            setSearchSelections={setSearchSelections}
            searchSelections={searchSelections}
            columns={columns}
            data={data}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;

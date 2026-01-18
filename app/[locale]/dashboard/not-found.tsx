"use client";

import { useState } from "react";
import AppSidebar from "@/components/dashboard/app-sidebar";
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
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("travelAgentDashboard");
  const [searchSelections, setSearchSelections] = useState<string>("fullName");
  const [columnFilters, setColumnFilters] = useState<any[]>([]);

  return (
    <SidebarProvider>
      <AppSidebar
        users={[]}
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

        <main className="flex flex-1 items-center justify-center p-6 text-muted-foreground">
          Unable to load dashboard data. Please check your connection.
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

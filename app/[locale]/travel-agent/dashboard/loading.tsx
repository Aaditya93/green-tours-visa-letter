import AppSidebar from "@/components/travel-agent/app-sidebar";
import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
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

export default function Loading() {
  const t = useTranslations("travelAgentDashboard");
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
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
        <Skeleton className=" ml-4 h-8 mb-4 w-[30rem]" />
        <div className="flex flex-1 flex-col gap-2 pt-0">
          <Skeleton className="ml-4 h-[1050px] w-full">
            <div className="border-b">
              {/* Header Row */}
              <div className=" border-b">
                <Skeleton className="h-14 w-full mb-2" />
              </div>

              {/* Data Rows */}
              {[...Array(12)].map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 border-b">
                  {[...Array(5)].map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className={`p-2 border-r last:border-r-0 ${
                        colIndex === 0 ? "col-span-1" : "col-span-1"
                      }`}
                    >
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Skeleton>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

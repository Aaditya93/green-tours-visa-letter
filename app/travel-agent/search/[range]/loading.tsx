import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterIcon } from "lucide-react";
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
import AppSidebar from "@/components/agent-platform/travel-agent/app-sidebar";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
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
                  <BreadcrumbPage>Search</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card className="w-full">
            <CardHeader className="bg-primary rounded-t-lg mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <CardTitle className="flex items-center text-xl font-bold text-center sm:text-left text-primary-foreground">
                  <FilterIcon className="mr-2 w-8 h-8 text-primary-foreground" />
                  Advanced Search
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search Filters Grid */}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Skeleton className="h-8 mt-2 w-full" />
                  <Skeleton className="h-8 mt-6 w-full" />
                  <Skeleton className="h-8 mt-6 w-full" />
                  <Skeleton className="h-8 mt-6 w-full" />
                </div>
                <div>
                  <Skeleton className="h-8 mt-2 w-full" />
                  <Skeleton className="h-8 mt-6 w-full" />
                  <Skeleton className="h-8 mt-6 w-full" />
                  <Skeleton className="h-8 mt-6 w-full" />
                </div>
                <div>
                  <Skeleton className="h-8 mt-2 w-full" />
                  <Skeleton className="h-8 mt-6 w-full" />
                  <Skeleton className="h-8 mt-6 w-full" />
                  <Skeleton className="h-8 mt-6 w-full" />
                </div>
                <div>
                  <Skeleton className="h-8 mt-2 w-full" />
                  <Skeleton className="h-8 mt-6 w-full" />
                </div>
                <div>
                  <Skeleton className="h-8 mt-2 w-full" />
                  <Skeleton className="h-8 mt-6 w-full" />
                </div>
              </div>
              <div className="flex  justify-end items-end">
                <Skeleton className="h-8 mt-2 w-24 ml-4" />
                <Skeleton className="h-8 mt-6 w-24 ml-4" />
                <Skeleton className="h-8 mt-6 w-24 ml-4" />
              </div>
              <div className="border-b mt-4">
                {/* Header Row */}
                <div className=" border-b">
                  <Skeleton className="h-12 w-full mb-2" />
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
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

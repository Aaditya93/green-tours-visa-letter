import AppSidebar from "@/components/agent-platform/travel-agent/app-sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
import { Skeleton } from "@/components/ui/skeleton";
import { DatePickerWithRange } from "@/components/agent-platform/payment/date-range";

export default function Loading() {
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
                  <BreadcrumbPage>Payment</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card className="w-full max-w-6xl sm:max-w-full mx-auto shadow-lg rounded-xl overflow-hidden ">
            <CardHeader className="bg-primary rounded-t-lg ">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-2xl font-bold tracking-tight text-primary-foreground">
                  Payment Dashboard
                </CardTitle>
                <DatePickerWithRange />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                <Skeleton className="h-[140px] w-full border-b mt-1 rounded-lg"></Skeleton>
                <Skeleton className="h-[140px] w-full border-b mt-1 rounded-lg"></Skeleton>
                <Skeleton className="h-[140px] w-full border-b mt-1 rounded-lg"></Skeleton>
                <Skeleton className="h-[140px] w-full border-b mt-1 rounded-lg"></Skeleton>
              </div>
              <Skeleton className="h-[540px] ml-4  mr-4 border-b  rounded-lg  "></Skeleton>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

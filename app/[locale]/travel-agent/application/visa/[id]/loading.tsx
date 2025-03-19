import { Skeleton } from "@/components/ui/skeleton";
import AppSidebar from "@/components/app-sidebar";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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

export default function LoadingPicture() {
  const t = useTranslations("travelAgentApplication");
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{t("title")}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t("code")} :</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-2">
            <div className="relative flex items-center justify-between p-4 ">
              <h2 className="text-2xl font-semibold">{t("visaApplication")}</h2>
              <Button
                variant="ghost"
                size={"icon"}
                className="p-2 text-red-500 hover:bg-red-50"
              >
                <AiOutlineDelete className="w-14 h-14" />
              </Button>
            </div>
            <div className="space-y-8">
              <Card>
                <CardHeader className="border-b p-4 sm:p-3">
                  <CardTitle className="text-lg">
                    {t("passportForm.passportDetails")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Skeleton className="h-[280px] w-full rounded" />
                    </div>
                    <div>
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="border-b p-4 sm:p-3">
                  <CardTitle className="text-lg">
                    {t("manualForm.travel_details")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Skeleton className="h-8 mt-2 w-full" />
                      <Skeleton className="h-8 mt-4 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-8 mt-2 w-full" />
                      <Skeleton className="h-8 mt-4 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-8 mt-2 w-full" />
                      <Skeleton className="h-8 mt-4 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-8 w-70" />
                    <Skeleton className="h-8 w-70" />
                  </div>

                  <Skeleton className="h-[70px] w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

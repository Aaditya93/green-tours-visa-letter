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
import AppSidebar from "@/components/travel-agent/app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

const Loading = () => {
  const t = useTranslations("applyVisa");
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
                {/* <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Upload</BreadcrumbLink>
                </BreadcrumbItem> */}
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t("title")}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="justify-center items-center flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex container mx-auto px-4 items-center justify-center">
            <Skeleton className="ml-4 h-[350px] mb-4 w-[30rem]">
              <Skeleton className="h-[60px] mb-2 w-[30rem]"></Skeleton>
            </Skeleton>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Loading;

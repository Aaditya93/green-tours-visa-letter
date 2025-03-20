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

import { serializeIApplication } from "@/config/serialize";
import AppSidebar from "@/components/app-sidebar";

import { getImmigrationCostAll } from "@/actions/agent-platform/immigration-cost";
import ImmigrationCard from "@/components/agent-platform/admin-panel/immigration-card";
import { getTranslations } from "next-intl/server";

const VisaLetterPrices = async ({
  params,
}: {
  params: Promise<{ range: string }>;
}) => {
  const { range } = await params;
  const prices = await getImmigrationCostAll();
  const planObj = serializeIApplication(prices);
  const t = await getTranslations("immigrationPrices");

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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ImmigrationCard immigrationData={planObj} range={range} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default VisaLetterPrices;
export const dynamic = "force-dynamic";

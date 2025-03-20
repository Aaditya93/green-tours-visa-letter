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
import ImmigrationForm from "@/components/agent-platform/admin-panel/immigration-form";
import { getImmigrationCostById } from "@/actions/agent-platform/immigration-cost";
import { getTranslations } from "next-intl/server";

const ImmigrationPricePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const prices = await getImmigrationCostById(id);
  const immigration = serializeIApplication(prices);
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
          <ImmigrationForm
            _id={immigration._id.toString()}
            name={immigration.name}
            visaLetterPrices={immigration.visaLetterPrices}
            createdAt={immigration.createdAt}
            updatedAt={immigration.updatedAt}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ImmigrationPricePage;
export const dynamic = "force-dynamic";

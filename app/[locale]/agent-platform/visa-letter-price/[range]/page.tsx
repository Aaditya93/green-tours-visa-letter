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
import { getVisaLetterPrices } from "@/actions/agent-platform/visa-letter";

import { serializeIApplication } from "@/config/serialize";
import AppSidebar from "@/components/app-sidebar";
import VisaPriceCard from "@/components/agent-platform/admin-panel/visa-price-card";
import CommandMenu from "@/components/agent-platform/admin-panel/command-menu";

const VisaLetterPrices = async ({
  params,
}: {
  params: Promise<{ range: string }>;
}) => {
  const { range } = await params;
  const prices = await getVisaLetterPrices();
  const planObj = serializeIApplication(prices);

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
                  <BreadcrumbPage>Apply Visa</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <CommandMenu companies={planObj} />

          <VisaPriceCard companies={planObj} range={range} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default VisaLetterPrices;
export const dynamic = "force-dynamic";

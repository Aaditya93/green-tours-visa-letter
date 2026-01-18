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

import { getVisaLetterPriceByCompany } from "@/actions/agent-platform/visa-letter/get-visa-letter-price-by-company";
import AppSidebar from "@/components/app-sidebar";
import PriceForm from "@/components/travel-agent/visa-letter/price-form";

const VisaLetterPricesEdit = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const data = await getVisaLetterPriceByCompany(id);
  const price = data.success ? data.data : null;
  if (!price) {
    return <div>Price data not found.</div>;
  }

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
                  <BreadcrumbPage>{price?.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="container mx-auto p-4">
          <PriceForm priceData={price} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default VisaLetterPricesEdit;
export const dynamic = "force-dynamic";

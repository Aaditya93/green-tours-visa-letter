"use server";
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
import PricingPage from "@/components/travel-agent/visa-letter/visa-letter";
import { auth } from "@/auth";
import { getVisaLetterPriceByCompany } from "@/actions/agent-platform/visa-letter";
import { serializeIApplication } from "@/config/serialize";

const VisaLetterPage = async () => {
  const session = await auth();
  const priceData = await getVisaLetterPriceByCompany(session?.user.companyId);

  const planObj = serializeIApplication(priceData.visaLetterPrices[0]);

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
                  <BreadcrumbPage>Visa Letter</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="justify-center items-center flex flex-1 flex-col gap-4 p-4 pt-0">
          {planObj?.prices ? (
            <PricingPage
              currency={planObj.currency}
              initialPriceData={planObj.prices}
            />
          ) : (
            <div>No pricing data available</div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default VisaLetterPage;

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
import ApplyNow from "@/components/travel-agent/apply-now/apply-now";
import { auth } from "@/auth";
import { getVisaLetterPriceByCompany } from "@/actions/agent-platform/visa-letter/get-visa-letter-price-by-company";
import { getTranslations } from "next-intl/server";

const ApplyVisaPage = async () => {
  const session = await auth();
  const priceData = await getVisaLetterPriceByCompany(session?.user.companyId);
  const t = await getTranslations("applyVisa");
  const currency = priceData.data?.currency || "USD";
  const planObj = priceData.data || { prices: [] };

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
          <ApplyNow
            currency={.currency}
            initialPriceData={planObj.prices}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ApplyVisaPage;

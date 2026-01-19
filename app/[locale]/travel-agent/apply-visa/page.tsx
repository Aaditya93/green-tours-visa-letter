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
  const companyData = await getVisaLetterPriceByCompany(
    session?.user.companyId,
  );
  const t = await getTranslations("applyVisa");

  if (!companyData.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
        <div className="bg-destructive/10 p-8 rounded-2xl max-w-md border border-destructive/20">
          <p className="text-destructive font-semibold">
            {t("errorFetchingData") ||
              "Error fetching pricing data. Please try again later."}
          </p>
        </div>
      </div>
    );
  }
  const currency = companyData.data.visaLetterPrices?.[0]?.currency;
  const prices = companyData.data.visaLetterPrices?.[0]?.prices;

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
          <ApplyNow currency={currency} initialPriceData={prices} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ApplyVisaPage;

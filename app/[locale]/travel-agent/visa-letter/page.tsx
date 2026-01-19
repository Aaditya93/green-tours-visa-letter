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
import { getVisaLetterPriceByCompany } from "@/actions/agent-platform/visa-letter/get-visa-letter-price-by-company";
import { getTranslations } from "next-intl/server";

export default async function VisaLetterLandingPage() {
  const [session, t] = await Promise.all([
    auth(),
    getTranslations("visa-letter"),
  ]);

  const companyId = session?.user?.companyId;
  const companyData = await getVisaLetterPriceByCompany(companyId);

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

  const priceConfig = companyData.data?.visaLetterPrices?.[0];
  const currency = priceConfig?.currency;
  const prices = priceConfig?.prices;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-sm">
                    {t("title")}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex-1 w-full max-w-full">
          {prices ? (
            <PricingPage
              currency={currency || "USD"}
              initialPriceData={prices}
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
              <div className="bg-muted/30 p-8 rounded-2xl max-w-md">
                <p className="text-muted-foreground font-medium">
                  {t("noPricingData") ||
                    "No pricing data available for your company."}
                </p>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

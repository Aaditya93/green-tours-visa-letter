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
import { getCompleteApplicationsTravelAgentBilling } from "@/actions/agent-platform/visa-letter";
import { convertToApplications } from "@/lib/data";
import BillingDashboard from "@/components/travel-agent/billing/billing-card";
import { serializedApplications, serializeData } from "@/config/serialize";
import { getTranslations } from "next-intl/server";
import { getBillsByCompany } from "@/actions/bill/get-bill-company";

import { auth } from "@/auth";

function extractDateRange(dateString: string) {
  try {
    if (!dateString) {
      throw new Error("No date string provided");
    }

    // Decode URL parameters if needed
    const decodedString = decodeURIComponent(dateString);

    // Extract dates using regex for better reliability
    const fromMatch = decodedString.match(/from=([^&]+)/);
    const toMatch = decodedString.match(/to=([^&]+)/);

    if (!fromMatch?.[1] || !toMatch?.[1]) {
      throw new Error("Date parameters not found");
    }

    const from = new Date(fromMatch[1]);
    const to = new Date(toMatch[1]);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new Error("Invalid date values");
    }

    return { from, to };
  } catch (error) {
    console.error("Error parsing date range:", error);
    const today = new Date();
    return {
      from: today,
      to: new Date(today.setDate(today.getDate() + 7)),
    };
  }
}

const BillingPage = async ({
  params,
}: {
  params: Promise<{ range: string }>;
}) => {
  const { range } = await params;
  const dateRange = extractDateRange(range);
  const applications = await getCompleteApplicationsTravelAgentBilling(
    dateRange.from,
    dateRange.to,
  );
  const session = await auth();

  const billsResult = await getBillsByCompany(
    session?.user?.companyId || "",
    dateRange.from,
    dateRange.to,
  );
  const bills = billsResult.success ? billsResult.data : [];
  const sBill = serializeData(bills);

  const t = await getTranslations("agentPayment");
  const Applications = convertToApplications(applications);
  const PlanObject = serializedApplications(Applications);

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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <BillingDashboard applications={PlanObject} bills={sBill} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default BillingPage;

import AppSidebar from "@/components/travel-agent/app-sidebar";
import VisaSearch from "@/components/travel-agent/search/search-card";
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
import { getCompleteApplicationsDateTravelAgent } from "@/actions/application/application";
import { serializedApplications } from "@/config/serialize";

import { Application } from "@/app/schemas/types";
import { getTranslations } from "next-intl/server";

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
function extractUniqueUsernames(data: Application[]) {
  // Get unique creator names
  const uniqueCreators = [...new Set(data.map((item) => item.creator))];

  // Transform into required format
  return uniqueCreators.map((username) => ({ username }));
}

const TravelAgentSearchPage = async ({
  params,
}: {
  params: Promise<{ range: string }>;
}) => {
  const { range } = await params;
  const dateRange = extractDateRange(range);
  const applications = await getCompleteApplicationsDateTravelAgent(
    dateRange.from,
    dateRange.to
  );
  const planObject = serializedApplications(applications ?? []);
  const t = await getTranslations("travelAgentSearch");

  const Users = extractUniqueUsernames(planObject);
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
          <VisaSearch Users={Users} data={planObject} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TravelAgentSearchPage;

export const dynamic = "force-dynamic";

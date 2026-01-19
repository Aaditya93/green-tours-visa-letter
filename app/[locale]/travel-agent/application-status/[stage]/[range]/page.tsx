import ApplicationCardTravelAgent from "@/components/travel-agent/application-status/application-card";
import CommandMenu from "@/components/command-menu";

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
import StatusSelect from "@/components/travel-agent/application-status/select-status";
import { getCompleteApplicationsTravelAgent } from "@/actions/agent-platform/application/get-complete-applications";
import { getIncompleteApplicationsTravelAgent } from "@/actions/agent-platform/application/get-incomplete-applications";
import { getProcessingApplicationTravelAgent } from "@/actions/agent-platform/application/get-processing-applications";
import { getTranslations } from "next-intl/server";
const ApplicationPage = async ({
  params,
}: {
  params: Promise<{ stage: string; range: string }>;
}) => {
  const { range, stage } = await params;
  const t = await getTranslations("travelAgentApplicationStatus");

  const pendingApplications =
    stage === "Incomplete"
      ? (await getIncompleteApplicationsTravelAgent()) || []
      : stage === "Delivered"
        ? (await getCompleteApplicationsTravelAgent()) || []
        : (await getProcessingApplicationTravelAgent()) || [];

  if (!pendingApplications.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
        <div className="bg-destructive/10 p-8 rounded-2xl max-w-md border border-destructive/20">
          <p className="text-destructive font-semibold">
            {t("errorFetchingData") ||
              "Error fetching application data. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  const applicationsData = pendingApplications.data;
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
          <div className="flex justify-between items-center w-full ">
            <div className="flex-shrink-0">
              <CommandMenu pendingApplications={applicationsData} />
            </div>
            <div className="flex-shrink-0">
              <StatusSelect />
            </div>
          </div>
          <ApplicationCardTravelAgent
            range={range}
            stage={stage}
            pendingApplications={applicationsData}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ApplicationPage;
export const dynamic = "force-dynamic";

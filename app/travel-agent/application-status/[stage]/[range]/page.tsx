import ApplicationCardTravelAgent from "@/components/agent-platform/travel-agent/application-status/application-card";
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

import {
  SerializabledApplication,
  serializeIApplication,
} from "@/config/serialize";
import AppSidebar from "@/components/agent-platform/travel-agent/app-sidebar";
import StatusSelect from "@/components/agent-platform/travel-agent/application-status/select-status";
import {
  getCompleteApplicationsTravelAgent,
  getIncompleteApplicationsTravelAgent,
  getProcessingApplicationTravelAgent,
} from "@/actions/agent-platform/visa-letter";

const ApplicationPage = async ({
  params,
}: {
  params: Promise<{ stage: string; range: string }>;
}) => {
  const { range, stage } = await params;

  const pendingApplications =
    stage === "Incomplete"
      ? (await getIncompleteApplicationsTravelAgent()) || []
      : stage === "Complete"
      ? (await getCompleteApplicationsTravelAgent()) || []
      : (await getProcessingApplicationTravelAgent()) || [];

  const pendingApplicationsObject = serializeIApplication(
    pendingApplications
  ) as SerializabledApplication[];

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
                  <BreadcrumbPage>Applications Status</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-between items-center w-full ">
            <div className="flex-shrink-0">
              <CommandMenu pendingApplications={pendingApplicationsObject} />
            </div>
            <div className="flex-shrink-0">
              <StatusSelect />
            </div>
          </div>
          <ApplicationCardTravelAgent
            range={range}
            stage={stage}
            pendingApplications={pendingApplicationsObject}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ApplicationPage;
export const dynamic = "force-dynamic";

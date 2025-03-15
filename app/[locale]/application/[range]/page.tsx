import AppSidebar from "@/components/app-sidebar";
import ApplicationCard from "@/components/application/application-card";
import CommandMenu from "@/components/command-menu";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
import { getIncompleteApplications } from "@/actions/application/application";
import {
  SerializabledApplication,
  serializeIApplication,
} from "@/config/serialize";

const ApplicationPage = async ({
  params,
}: {
  params: Promise<{ range: string }>;
}) => {
  const { range } = await params;

  const pendingApplications = (await getIncompleteApplications()) || [];
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Applications</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <CommandMenu pendingApplications={pendingApplicationsObject} />
          <ApplicationCard
            range={range}
            pendingApplications={pendingApplicationsObject}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ApplicationPage;
export const dynamic = "force-dynamic";

import { getApplicationById } from "@/actions/application/model";
import AppSidebar from "@/components/travel-agent/app-sidebar";
import ApplicationFormTravelAgent from "@/components/travel-agent/apply-now/application-form";
import Error from "@/components/application/error";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "next-intl/server";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  SerializabledApplication,
  serializeIApplication,
} from "@/config/serialize";

const VisaPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const application = await getApplicationById(id);

  const t = await getTranslations("travelAgentApplication");

  if (!application) {
    return <Error />;
  }
  const applicationSerialized = serializeIApplication(
    application
  ) as SerializabledApplication;

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
                  <BreadcrumbLink href="#">{t("title")}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {t("code")} : {application?.code}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ApplicationFormTravelAgent Application={applicationSerialized} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default VisaPage;

export const dynamic = "force-dynamic";

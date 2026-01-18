import { getTravelAgentUsers } from "@/actions/agent-platform/admin-panel/get-travel-agent-users";
import AppSidebar from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
import UserApprovalCards from "@/components/agent-platform/admin-panel/ta-account";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";

const AdminPanel = async () => {
  const TravelAgent = await getTravelAgentUsers();
  if (!TravelAgent.success) {
    throw new Error("Failed to fetch travel agent users");
  }

  const t = await getTranslations("adminPanel");

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
          <Card className="w-full max-w-6xl sm:max-w-full mx-auto shadow-lg rounded-xl overflow-hidden ">
            <CardHeader className=" border-b p-4 sm:p-3 bg-primary">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <CardTitle className="text-xl  text-primary-foreground font-bold text-center sm:text-left">
                  {t("title1")}
                </CardTitle>
                <Badge variant={"secondary"}>
                  {t("title2")} :{" "}
                  {Array.isArray(TravelAgent.data)
                    ? TravelAgent.data.length
                    : 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className=" space-y-4 p-0 ">
              <UserApprovalCards data={TravelAgent.data} />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminPanel;
export const dynamic = "force-dynamic";

import { getTravelAgentUsers } from "@/actions/agent-platform/admin-panel/admin-panel";
import AppSidebar from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
import UserApprovalCards from "@/components/agent-platform/admin-panel/ta-account";
import { Badge } from "@/components/ui/badge";

const AdminPanel = async () => {
  const TravelAgent = await getTravelAgentUsers();
  const plainObject = JSON.parse(JSON.stringify(TravelAgent));

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
                  <BreadcrumbLink href="#">Agent Platform</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Admin Panel</BreadcrumbPage>
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
                  Pending Approval
                </CardTitle>
                <Badge variant={"secondary"}>
                  Total Applications :{" "}
                  {Array.isArray(plainObject) ? plainObject.length : 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className=" space-y-4 p-0 ">
              <UserApprovalCards data={plainObject} />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminPanel;
export const dynamic = "force-dynamic";

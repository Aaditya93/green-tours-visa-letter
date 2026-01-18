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
import AppSidebar from "@/components/app-sidebar";
import CreateBill from "@/components/agent-platform/create-bill/create-bill";
import { getAllCompaniesForBilling } from "@/actions/bill/get-companies";
import { getTranslations } from "next-intl/server";
const CreateBillPage = async () => {
  const companiesResult = await getAllCompaniesForBilling();
  const companies = companiesResult.success ? companiesResult.data : [];
  const t = await getTranslations("createBill");
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
        <div className="container mx-auto p-4">
          <CreateBill companies={companies} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CreateBillPage;
export const dynamic = "force-dynamic";

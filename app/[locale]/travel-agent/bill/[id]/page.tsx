import AppSidebar from "@/components/travel-agent/app-sidebar";
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
import { getBillById } from "@/actions/bill/get-bill";
import { getApplicationsByBillId } from "@/actions/bill/get-applications-by-bill";
import BillDetail from "@/components/travel-agent/bill/bill";
import { serializeData, serializeIApplication } from "@/config/serialize";
import { getTranslations } from "next-intl/server";

const BillPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const billResult = await getBillById(id);
  const bill = billResult.success ? billResult.data : null;
  const Sbill = serializeData(bill);

  const applicationsResult = await getApplicationsByBillId(id);
  const Applications = applicationsResult.success
    ? applicationsResult.data
    : [];
  const SApplications = serializeIApplication(Applications);
  const t = await getTranslations("bill");

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
                  <BreadcrumbPage>
                    {t("title")} {bill ? Sbill._id.toString() : "N/A"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {bill && (
          <BillDetail
            billId={Sbill._id.toString()}
            bill={Sbill}
            applications={SApplications}
          />
        )}

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0"></div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default BillPage;

export const dynamic = "force-dynamic";

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
import { getBillById } from "@/actions/bill/create-bill";
import { getApplicationByBillId } from "@/actions/bill/create-bill";
import BillDetail from "@/components/travel-agent/bill/bill";
import { serializeData, serializeIApplication } from "@/config/serialize";

const BillPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const bill = await getBillById(id);
  const Sbill = serializeData(bill);
  const Applications = await getApplicationByBillId(id);
  const SApplications = serializeIApplication(Applications);

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
                    Bill ID: {bill ? Sbill._id.toString() : "N/A"}
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

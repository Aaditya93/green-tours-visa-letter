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
import { getAllVisaLettersByCompany } from "@/actions/agent-platform/visa-letter";
import VisaLetterCard from "@/components/travel-agent/visa-letter/visa-letter-card";
import { serializeData } from "@/config/serialize";
import { auth } from "@/auth";
const CompanyVisaLetterPage = async ({
  params,
}: {
  params: Promise<{ range: string }>;
}) => {
  const { range } = await params;
  const session = await auth();

  const VisaLetters = await getAllVisaLettersByCompany(session?.user.companyId);
  const SvisaLetter = await serializeData(VisaLetters);

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
                  <BreadcrumbPage>Visa Letters</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <VisaLetterCard range={range} visaLetters={SvisaLetter || []} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CompanyVisaLetterPage;
export const dynamic = "force-dynamic";

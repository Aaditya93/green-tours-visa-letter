import AppSidebar from "@/components/app-sidebar";

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
  getAllCompanies,
  getAllVisaLettersByCompany,
} from "@/actions/agent-platform/visa-letter";
import VisaLetterCard from "@/components/agent-platform/send-visa-letter/visa-letter-applications";
import { serializeData } from "@/config/serialize";
import { getTranslations } from "next-intl/server";
const CompanyVisaLetterPage = async ({
  params,
}: {
  params: Promise<{ company: string; range: string }>;
}) => {
  const { company, range } = await params;
  const Companies = await getAllCompanies();
  const t = await getTranslations("companyVisaLetter");

  const VisaLetters = await getAllVisaLettersByCompany(company);
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
                  <BreadcrumbPage>{t("title")}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <VisaLetterCard
            range={range}
            visaLetters={SvisaLetter || []}
            companies={Companies}
            companyId={company}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CompanyVisaLetterPage;
export const dynamic = "force-dynamic";

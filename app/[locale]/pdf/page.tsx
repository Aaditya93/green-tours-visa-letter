import AppSidebar from "@/components/app-sidebar";
import PDFUploader from "@/components/pdf/pdf";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
const PdfPage = () => {
  const t = useTranslations("AdminPDF");
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
                <BreadcrumbItem>
                  <BreadcrumbPage>{t("title")}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="justify-center items-center flex flex-1 flex-col gap-4 p-4 pt-0">
          <PDFUploader />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PdfPage;

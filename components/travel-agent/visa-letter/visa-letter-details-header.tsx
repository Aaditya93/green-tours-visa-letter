import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface VisaLetterDetailsHeaderProps {
  visaLetterId?: string;
  documentUrl: string;
  translations: {
    title1: string;
    download: string;
  };
}

/**
 * Server Component for the header section of the visa letter details page.
 */
export const VisaLetterDetailsHeader = ({
  visaLetterId,
  documentUrl,
  translations,
}: VisaLetterDetailsHeaderProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <span className="font-semibold text-sm">
                {translations.title1}: {visaLetterId || "N/A"}
              </span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="default" size="sm" className="gap-2 shadow-sm">
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{translations.download}</span>
          </a>
        </Button>
      </div>
    </header>
  );
};

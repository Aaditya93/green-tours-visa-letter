import AppSidebar from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getApplicationsByPassportIds } from "@/actions/bill/visa-letter/get-applications-by-passports";
import { getVisaLetterById } from "@/actions/bill/visa-letter/get-visa-letter";
import { convertToApplications } from "@/lib/data";
import { getTranslations } from "next-intl/server";

// Import refactored sub-components
import { VisaLetterDetailsHeader } from "@/components/travel-agent/visa-letter/visa-letter-details-header";
import { VisaLetterPDFViewer } from "@/components/travel-agent/visa-letter/visa-letter-pdf-viewer";
import { VisaLetterApplicationsTable } from "@/components/travel-agent/visa-letter/visa-letter-applications-table";

interface VisaLetterPageProps {
  params: { id: string; locale: string };
}

/**
 * Server Component for the Visa Letter Details page.
 * Handles data fetching and orchestrates sub-components.
 */
const VisaLetterPage = async ({ params }: VisaLetterPageProps) => {
  const { id } = await params;

  // Fetch data on the server
  const [visaLetterResult, t] = await Promise.all([
    getVisaLetterById(id),
    getTranslations("visaLetter"),
  ]);

  const visaLetterData = visaLetterResult.success
    ? visaLetterResult.data
    : null;

  const applicationsResult = await getApplicationsByPassportIds(
    visaLetterData?.passportIds || [],
  );

  const rawApplications = applicationsResult.success
    ? applicationsResult.data
    : [];
  const applications = convertToApplications(rawApplications);

  const totalCost = applications.reduce((sum, app) => sum + app.cost, 0);
  const currency = applications[0]?.currency || "USD";

  const documentUrl = visaLetterData?.visaLetter || "";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <VisaLetterDetailsHeader
          visaLetterId={visaLetterData?.visaLetterId}
          documentUrl={documentUrl}
          translations={{
            title1: t("title1"),
            download: t("download"),
          }}
        />

        <main className="flex flex-1 flex-col gap-8 p-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Document Preview Section */}
          <section aria-labelledby="document-preview">
            <VisaLetterPDFViewer
              documentUrl={documentUrl}
              translations={{
                title2: t("title2"),
                message1: t("message1"),
                message2: t("message2"),
                message3: t("message3"),
              }}
            />
          </section>

          {/* Applications Table Section */}
          <section aria-labelledby="applications-list">
            <VisaLetterApplicationsTable
              applications={applications}
              totalCost={totalCost}
              currency={currency}
              translations={{
                application: t("application"),
                name: t("name"),
                passportNumber: t("passportNumber"),
                duration: t("duration"),
                speed: t("speed"),
                cost: t("cost"),
                days: t("days"),
                total: t("total"),
              }}
            />
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default VisaLetterPage;

export const dynamic = "force-dynamic";

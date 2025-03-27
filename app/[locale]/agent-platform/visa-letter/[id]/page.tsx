import AppSidebar from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  getApplicationsByPassportIds,
  getVisaLetter,
} from "@/actions/bill/send-visa-letter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { convertToApplications } from "@/lib/data";

const VisaLetterPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const visaLetter = await getVisaLetter(id);
  // Check if visaLetter is an array and get the first item, or use it directly if it's an object
  const visaLetterData = Array.isArray(visaLetter) ? visaLetter[0] : visaLetter;
  const applications =
    (await getApplicationsByPassportIds(visaLetterData?.passportIds || [])) ||
    [];
  const Application = await convertToApplications(applications);
  const totalCost = applications.reduce((sum, app) => sum + app.cost, 0);
  const currency = applications[0]?.currency || "USD";

  // Improved URL handling for AWS S3 PDF links
  const documentUrl = visaLetterData?.visaLetter
    ? visaLetterData.visaLetter
    : "";

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
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  Visa Letter ID: {visaLetterData?.visaLetterId}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="ml-auto mr-4">
            <Button asChild className="gap-2">
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Document Preview */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 bg-primary text-background rounded-t-lg">
              <CardTitle className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-background " />
                Visa Letter Document
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[500px] relative">
              {documentUrl ? (
                <object
                  data={documentUrl}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <p>
                      Unable to display PDF.
                      <a
                        href={documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-600 underline"
                      >
                        Click here to view the document
                      </a>
                    </p>
                  </div>
                </object>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No document available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Applications Table */}
          <Card>
            <CardHeader className="pb-3 flex flex-row justify-between items-center bg-primary text-background rounded-t-lg">
              <CardTitle>Applications</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={"secondary"}>
                  {Application.length}{" "}
                  {Application.length === 1 ? "Person" : "People"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Passport</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Application.map((app) => (
                    <TableRow key={app.id.toString()}>
                      <TableCell className="font-medium">
                        {app.fullName}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {app.passportNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">
                            {app.travelDuration} days
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {app.duration}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {app.fromDate} - {app.toDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {app.speed}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {app.cost} {app.currency}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell colSpan={4} className="text-right">
                      Total
                    </TableCell>
                    <TableCell className="text-right">
                      {totalCost} {currency}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default VisaLetterPage;

export const dynamic = "force-dynamic";

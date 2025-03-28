"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { v4 as uuid } from "uuid";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/agent-platform/create-bill/date-picker";
import { format } from "date-fns";
import { ChevronRight, FileText, Loader2 } from "lucide-react";
import { getApplicationsVisaLetter } from "@/actions/application/application";
import { toast } from "sonner";
import { CreateVisaLetter } from "@/actions/bill/send-visa-letter";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Define types
type Company = {
  id: string;
  name: string;
  companyAddress: string;
  companyEmail: string;
};

interface CreateBillProps {
  companies: Company[];
}
export interface Application {
  id: string;
  name: string;
  cost: number;
  currency: string;
  passportId: string;
  applicationId: string;
  nationality: string;
  bill: boolean;
  payment: boolean;
  passportNumber: string;
  applicationCode: string;
  duration: string;
  speed: string | null;
}

export default function VisaLetterPage({ companies }: CreateBillProps) {
  const Router = useRouter();
  const t = useTranslations("sendVisaLetter");
  const [visaLetterFile, setVisaLetterFile] = useState<File | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [step, setStep] = useState(1);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  // Move this state to the top level
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // Move useEffect to the top level
  useEffect(() => {
    if (visaLetterFile) {
      const url = URL.createObjectURL(visaLetterFile);
      setPdfPreviewUrl(url);

      // Clean up URL object when component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [visaLetterFile]);

  const fetchApplications = async () => {
    // Only fetch if we have valid dates
    if (startDate && endDate && selectedCompany) {
      setIsLoading(true);

      try {
        const applicationData = await getApplicationsVisaLetter(
          selectedCompany.id,
          startDate,
          endDate
        );

        if (applicationData && Array.isArray(applicationData)) {
          // Transform the data to match your Application type
          setApplications(applicationData);
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
        // You might want to show an error notification here
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ...existing code...
  const handleNext = async () => {
    if (step === 1) {
      if (!selectedCompany || !startDate || !endDate) {
        toast.error(t("error1"));
        return;
      }

      fetchApplications();
      setStep(2);
    } else if (step === 2) {
      if (selectedApplications.length === 0) {
        toast.error(t("error2"));
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!visaLetterFile) {
        toast.error(t("error3"));
        return;
      }
      setIsLoading(true);
      try {
        const uu = uuid();
        const id = await CreateVisaLetter(
          visaLetterFile,
          selectedCompany,
          selectedApplications,
          uu
        );
        Router.push(`/agent-platform/visa-letter/${id}`);

        toast.success(t("success"));
      } catch (error) {
        console.error("Failed to upload visa letter", error);
        toast.error(t("error4"));
      } finally {
        setIsLoading(false);
      }
    }
  };
  // Add this function below your other handlers like handleNext, handleBack, etc.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if the file is a PDF
      if (file.type !== "application/pdf") {
        toast.error(t("error5"));
        return;
      }
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t("error6"));
        return;
      }
      setVisaLetterFile(file);
    }
  };
  // ...existing code...
  const handleBack = () => {
    setStep(1);
    setSelectedApplications([]);
  };

  const toggleApplicationSelection = (id: string) => {
    setSelectedApplications((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  // Calculate total cost of selected applications
  const calculateTotalCost = () => {
    return applications
      .filter((app) => selectedApplications.includes(app.passportId))
      .reduce((sum, app) => sum + (app.cost || 0), 0);
  };

  // Step 1: Company and date selection
  const renderCompanySelection = () => (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-primary rounded-t-lg text-background border-b pb-5">
        <div className="flex items-start gap-3">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight text-background">
              {t("title")}
            </CardTitle>
            <CardDescription className="mt-1.5 text-background">
              {t("title1")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 mt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("company")}</label>
          <Select
            value={selectedCompany?.id || ""}
            onValueChange={(value) => {
              const company = companies.find((c) => c.id === value);
              if (company) {
                setSelectedCompany(company);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("select")} />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("startDate")}</label>
            <DatePicker
              date={startDate}
              setDate={setStartDate}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("endDate")}</label>
            <DatePicker
              date={endDate}
              setDate={setEndDate}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleNext} className="flex items-center gap-1">
          {t("next")} <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  // Step 2: Application selection
  const renderApplicationSelection = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {t("action")}
          </CardTitle>
          <Button variant="outline" onClick={handleBack}>
            t({"back"})
          </Button>
        </div>
        <CardDescription>
          {companies.find((c) => c.id === selectedCompany?.id)?.name} -
          {startDate && endDate
            ? ` ${format(startDate, "PPP")} to ${format(endDate, "PPP")}`
            : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <span className="text-sm font-medium">
                {selectedApplications.length} of {applications.length}{" "}
                {t("selected")}
                {selectedApplications.length > 0 && (
                  <span className="ml-2 text-primary">
                    {t("total")}: {calculateTotalCost()}{" "}
                    {applications.length > 0 ? applications[0].currency : "USD"}
                  </span>
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedApplications.length === applications.length) {
                    setSelectedApplications([]);
                  } else {
                    setSelectedApplications(
                      applications.map((app) => app.passportId)
                    );
                  }
                }}
              >
                {selectedApplications.length === applications.length
                  ? t("deselectAll")
                  : t("selectAll")}
              </Button>
            </div>

            <div className="border rounded-md max-h-[400px] overflow-y-auto">
              {applications.map((app, index) => (
                <div key={app.passportId}>
                  {index > 0 && <Separator />}
                  <div
                    className={`p-4 cursor-pointer hover:bg-muted/50 flex justify-between items-center ${
                      selectedApplications.includes(app.passportId)
                        ? "bg-primary/5"
                        : ""
                    }`}
                    onClick={() => toggleApplicationSelection(app.passportId)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{app.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {t("passportNumber")}: {app.passportNumber} •{" "}
                        {app.nationality}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("code")}: {app.applicationCode} • {app.duration} •
                        {app.speed ? ` Processing: ${app.speed}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium text-primary">
                          {app.cost} {app.currency}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="ml-2 h-5 w-5"
                        checked={selectedApplications.includes(app.passportId)}
                        onChange={() => {}} // Handled by the div click
                      />
                    </div>
                  </div>
                </div>
              ))}

              {applications.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  {t("message")}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm">
          {selectedApplications.length > 0 && (
            <span className="font-medium">
              {t("total")}: {calculateTotalCost()}{" "}
              {applications.length > 0 ? applications[0].currency : "USD"}
            </span>
          )}
        </div>
        <Button
          onClick={handleNext}
          disabled={selectedApplications.length === 0 || isLoading}
          className="flex items-center gap-1"
        >
          {t("upload")}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  const renderVisaLetterUpload = () => {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="bg-primary rounded-t-lg text-background border-b pb-5">
          <div className="flex items-start gap-3">
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight text-background">
                {t("upload")}
              </CardTitle>
              <CardDescription className="mt-1.5 text-background">
                {t("description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("description1")}</label>
            {!visaLetterFile && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="visaLetter"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="visaLetter"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {visaLetterFile
                      ? visaLetterFile.name
                      : "Click to upload PDF file"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t("message1")}
                  </span>
                  {visaLetterFile && (
                    <div className="mt-2 text-sm text-green-600 font-medium">
                      {t("message2")} {visaLetterFile.name}
                    </div>
                  )}
                </label>
              </div>
            )}
          </div>

          {pdfPreviewUrl && (
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("title3")}</label>
              <div
                className="border rounded-lg overflow-hidden"
                style={{ height: "400px" }}
              >
                <iframe
                  src={pdfPreviewUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(2)}>
            {t("back")}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!visaLetterFile || isLoading}
            className="flex items-center gap-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("processing")}
              </>
            ) : (
              <>
                {t("submit")} <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Update the return statement
  return (
    <div className="container py-0 pt-0">
      {step === 1
        ? renderCompanySelection()
        : step === 2
        ? renderApplicationSelection()
        : renderVisaLetterUpload()}
    </div>
  );
}

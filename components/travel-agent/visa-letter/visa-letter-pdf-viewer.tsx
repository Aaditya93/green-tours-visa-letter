import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VisaLetterPDFViewerProps {
  documentUrl: string;
  translations: {
    title2: string;
    message1: string;
    message2: string;
    message3: string;
  };
}

/**
 * Server Component for viewing visa letter PDF documents.
 */
export const VisaLetterPDFViewer = ({
  documentUrl,
  translations,
}: VisaLetterPDFViewerProps) => {
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="pb-3 bg-primary text-background rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {translations.title2}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[600px] relative">
        {documentUrl ? (
          <object
            data={documentUrl}
            type="application/pdf"
            className="w-full h-full rounded-b-lg border-0"
            aria-label="Visa Letter PDF"
          >
            <div className="w-full h-full flex items-center justify-center p-8 text-center text-muted-foreground bg-muted/20">
              <div className="max-w-md">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="mb-4">{translations.message1}</p>
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
                >
                  {translations.message2}
                </a>
              </div>
            </div>
          </object>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/20">
            <FileText className="h-12 w-12 opacity-20" />
            <p className="font-medium">{translations.message3}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

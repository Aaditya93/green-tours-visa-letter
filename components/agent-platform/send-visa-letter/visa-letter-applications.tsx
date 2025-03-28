"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Download,
  FileText,
  Calendar,
  Building,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import PaginationComponent from "./pagination";
import SelectCompany from "./select-company";
import { useTranslations } from "next-intl";

interface VisaLetter {
  _id: any;
  visaLetterId: string;
  passportIds: string[];
  companyName: string;
  companyId: string;
  companyAddress: string;
  companyEmail: string;
  visaLetter: string;
  createdDate: Date;
}

interface VisaLetterListProps {
  visaLetters: VisaLetter[];
  range: string;
  companies: any;
  companyId: string;
}

const VisaLetterCard = (props: VisaLetterListProps) => {
  const range = props.range;
  const NumRange = parseInt(range, 10);
  const visaLetters = props.visaLetters;
  const totalPages = Math.ceil(visaLetters.length / 10);
  const currentPage = NumRange / 10;
  const itemsPerPage = 10; // Items per page

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Function to extract filename from URL
  const getFileName = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1] || "document.pdf";
  };
  const t = useTranslations("companyVisaLetter");

  // Get short version of visa letter ID
  const getShortId = (id: string) => {
    return id.substring(0, 8) + "...";
  };

  return (
    <Card className="w-full max-w-6xl sm:max-w-full mx-auto shadow-sm rounded-md overflow-hidden border border-border">
      <CardHeader className="p-4 sm:p-3 bg-primary text-primary-foreground rounded-t-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <CardTitle className="text-xl font-bold text-center sm:text-left">
            {t("title")}
            <SelectCompany companies={props.companies} />
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-white/20 text-primary-foreground border-none"
          >
            {visaLetters.length} {t("total")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {visaLetters.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {t("message")}
            </div>
          ) : (
            visaLetters
              .slice(NumRange - 10, NumRange)
              .map((letter: VisaLetter) => (
                <div
                  key={letter.visaLetterId}
                  className="border-b border-border p-4 hover:bg-secondary/50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {t("id")}: {getShortId(letter.visaLetterId)}
                      </Badge>
                      <Badge variant="secondary">
                        {letter.passportIds.length}{" "}
                        {letter.passportIds.length === 1
                          ? `${t("application")}`
                          : `${t("applications")}`}
                      </Badge>
                    </div>
                  </div>

                  <Link
                    href={`/agent-platform/visa-letter/${letter._id}`}
                    className="block"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-start space-x-3">
                        <Building className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {t("company")}
                          </p>
                          <p className="font-medium text-sm">
                            {letter.companyName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Calendar className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {t("created")}
                          </p>
                          <p className="text-sm">
                            {formatDateTime(letter.createdDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <FileText className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {t("file")}
                          </p>
                          <p className="text-xs font-mono truncate max-w-[180px]">
                            {getFileName(letter.visaLetter)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="flex justify-between items-center mt-4 pt-3 ">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary hover:text-primary/80 hover:bg-primary/5"
                      asChild
                    >
                      <Link href={`/agent-platform/visa-letter/${letter._id}`}>
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        {t("view")}
                      </Link>
                    </Button>
                    <Button variant="default" size="sm" asChild>
                      <a
                        href={letter.visaLetter}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        {t("download")}
                      </a>
                    </Button>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>

      {visaLetters.length > 0 && (
        <CardFooter className="bg-muted p-4 sm:p-3 flex justify-between items-center border-t border-border">
          <p className="text-sm text-muted-foreground">
            {t("message2")} {formatDateTime(new Date())}
          </p>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            companyId={props.companyId}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default VisaLetterCard;

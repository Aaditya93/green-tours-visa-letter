"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PiArrowCircleRightThin } from "react-icons/pi";
import { CiMap, CiUser, CiPassport1, CiCalendar } from "react-icons/ci";
import { IoCreateOutline } from "react-icons/io5";
import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import Link from "next/link";
import { deleteApplication } from "@/actions/application/model";
import { useTranslations } from "next-intl"; // Import the translation hook

import { useEffect } from "react";

import { SerializabledApplication } from "@/config/serialize";
import PaginationComponentTravelAgent from "./pangination";

interface ApplicationCardProps {
  pendingApplications: SerializabledApplication[];
  range: string;
  stage: string;
}

const ApplicationCardTravelAgent = (
  ApplicationCardProps: ApplicationCardProps
) => {
  const t = useTranslations("travelAgentApplicationStatus"); // Initialize translations

  const range = ApplicationCardProps.range;
  const NumRange = parseInt(range, 10);
  const pendingApplications = ApplicationCardProps.pendingApplications;
  const totalPages = Math.ceil(pendingApplications.length / 10);
  const currentPage = NumRange / 10;
  const itemsPerPage = 10;
  const stage = ApplicationCardProps.stage;
  // Items per page

  const [calltoast, setCallToast] = React.useState(false);
  useEffect(() => {
    if (calltoast) {
      toast.success(t("toast.deleted"), {});
      setCallToast(false);
    }
  }, [calltoast]);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full max-w-6xl sm:max-w-full mx-auto shadow-lg rounded-xl overflow-hidden ">
      <CardHeader className=" border-b p-4 sm:p-3 bg-primary rounded-t-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <CardTitle className="text-xl text-background font-bold text-center sm:text-left ">
            {stage === "Incomplete"
              ? t("status.incomplete")
              : stage === "Complete"
              ? t("status.complete")
              : t("status.processing")}{" "}
            {t("title1")}
          </CardTitle>
          <Badge variant={"secondary"}>
            {t("labels.totalApplications")} : {pendingApplications.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="">
          {pendingApplications
            .slice(NumRange - 10, NumRange)
            .map((app: SerializabledApplication) => (
              <div
                key={app.code}
                className="border-b p-4 hover:bg-secondary transition-colors duration-200 relative"
              >
                <Button
                  variant="link"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 "
                  asChild
                >
                  <Link href={`/travel-agent/application/visa/${app._id}`}>
                    <PiArrowCircleRightThin className="w-5 h-5 sm:w-4 sm:h-4" />{" "}
                    {app.isCompleted
                      ? t("details.view")
                      : t("actions.completeApplication")}
                  </Link>
                </Button>
                <div className="space-y-3">
                  <div className="flex items-start flex-wrap gap-2">
                    <Badge variant="outline">#{app.code}</Badge>
                    <Badge variant="secondary">
                      {app.noOfVisa > 1
                        ? t("labels.group")
                        : t("labels.individual")}
                    </Badge>
                    <div>
                      {app.passportDetails[0].stage === "Not Processed" && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            deleteApplication(
                              app._id?.toString() || "",
                              app.id?.toString() || ""
                            );

                            setCallToast(true);
                          }}
                          className="absolute right-3 w-5 h-5 text-red-500"
                        >
                          <AiOutlineDelete />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Link href={`/application/visa/${app._id}`}>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <CiUser className="w-5 h-5 flex-shrink-0 sm:w-4 sm:h-4" />
                        <div>
                          <p className="text-xs">{t("details.name")}</p>
                          <p className="font text-sm">
                            {app.passportDetails[0].fullName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CiMap className="w-5 h-5 flex-shrink-0 sm:w-4 sm:h-4" />
                        <div>
                          <p className="text-xs">{t("details.country")}</p>
                          <p className="text-sm">
                            {app.passportDetails[0].nationalityCurrent}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CiPassport1 className="w-5 h-5 flex-shrink-0 sm:w-4 sm:h-4" />
                        <div>
                          <p className="text-xs">
                            {t("details.passportNumber")}
                          </p>
                          <p className="text-sm">
                            {app.passportDetails[0].passportNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CiCalendar className="w-5 h-5 flex-shrink-0 sm:w-4 sm:h-4" />
                        <div>
                          <p className="text-xs">{t("details.birthday")}</p>
                          <p className="text-sm">
                            {formatDate(app.passportDetails[0].birthday)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {app.passportDetails[0].sex === "Nam" ? (
                          <>
                            <LiaMaleSolid className="w-5 h-5 text-primary/70 flex-shrink-0 sm:w-4 sm:h-4" />
                            <div>
                              <p className="text-xs">{t("details.gender")}</p>
                              <p className=" text-sm">
                                {app.passportDetails[0].sex}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <LiaFemaleSolid className="w-5 h-5 text-primary/70 flex-shrink-0 sm:w-4 sm:h-4" />
                            <div>
                              <p className="text-xs">{t("details.gender")}</p>
                              <p className="text-sm">
                                {app.passportDetails[0].sex}
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <IoCreateOutline className="w-5 h-5 text-primary/70 flex-shrink-0 sm:w-4 sm:h-4" />
                        <div>
                          <p className="text-xs">{t("details.created")}</p>
                          <p className="text-sm">{app.creator.creator}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
      <CardFooter className="bg-background p-4 sm:p-3 flex justify-between items-center">
        <p className="text-sm">
          {t("details.updated")}: {formatDateTime(new Date())}{" "}
        </p>
        <PaginationComponentTravelAgent
          stage={stage}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
        />
      </CardFooter>
    </Card>
  );
};

export default ApplicationCardTravelAgent;

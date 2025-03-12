"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PiBuildingLight } from "react-icons/pi";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PiArrowCircleRightThin } from "react-icons/pi";
import { CiMap } from "react-icons/ci";

import Link from "next/link";

import { useEffect } from "react";
import PaginationComponent from "./pangination";
import { Types } from "mongoose";

interface ImmigrationData {
  _id: Types.ObjectId;
  name: string;
  ImmigrationPrices: any[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
export const convertToVietnamTime = (date: string | Date): string => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return formatter.format(new Date(date));
};

interface ImmigrationCardProps {
  immigrationData: ImmigrationData[];
  range: string;
}

const ImmigrationCard = ({ immigrationData, range }: ImmigrationCardProps) => {
  const NumRange = parseInt(range, 10);

  const currentPage = NumRange / 10;
  const itemsPerPage = 10; // Items per page
  const totalPages = Math.ceil((immigrationData?.length || 0) / itemsPerPage);
  const [calltoast, setCallToast] = React.useState(false);
  useEffect(() => {
    if (calltoast) {
      toast.success("Application has been deleted", {});
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

  return (
    <Card className="w-full max-w-6xl sm:max-w-full mx-auto shadow-lg rounded-xl overflow-hidden ">
      <CardHeader className="p-4 sm:p-3 bg-primary rounded-t-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <CardTitle className="text-xl font-bold text-center sm:text-left text-primary-foreground">
            Immigration Prices
          </CardTitle>
          <Badge variant={"secondary"} className="text-primary">
            Total Immigration Centers : {immigrationData?.length || 0}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="">
          {immigrationData?.slice(NumRange - 10, NumRange).map((app: any) => (
            <div
              key={app.code}
              className="border-b p-4 hover:bg-primary-foreground transition-colors duration-200 relative"
            >
              <Button
                variant="link"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-primary-foreground"
                asChild
              >
                <Link
                  href={`/agent-platform/immigration-price/location/${app._id}`}
                >
                  <PiArrowCircleRightThin className="w-5 h-5 sm:w-4 sm:h-4" />{" "}
                  Edit Prices
                </Link>
              </Button>
              <div className="space-y-3">
                <div className="flex items-start flex-wrap gap-2">
                  <Badge variant="outline">ID : {app._id}</Badge>
                </div>
                <Link
                  href={`/agent-platform/visa-letter-price/company/${app._id}`}
                >
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <PiBuildingLight className="w-5 h-5 flex-shrink-0 sm:w-4 sm:h-4" />
                      <div>
                        <p className="text-xs">Immigration</p>
                        <p className="font text-sm">{app.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CiMap className="w-5 h-5 flex-shrink-0 sm:w-4 sm:h-4" />
                      <div>
                        <p className="text-xs">Last Price Updated</p>
                        <p className="text-sm">
                          {convertToVietnamTime(app.updatedAt)}
                        </p>
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
        <p className="text-sm">Last Updated: {formatDateTime(new Date())} </p>
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
        />
      </CardFooter>
    </Card>
  );
};

export default ImmigrationCard;

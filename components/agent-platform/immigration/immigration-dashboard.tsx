"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, Users, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Application } from "@/app/schemas/types";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import ImmigrationTable from "./immigration-table";
import { format } from "date-fns";
import DatePickers from "./date-range";

interface DurationGroups {
  days15: Application[];
  days30: Application[];
}

const groupApplicationsByDuration = (
  applications: Application[]
): DurationGroups => {
  return {
    days15: applications.filter((app) => app.travelDuration === 15),
    days30: applications.filter((app) => app.travelDuration === 30),
  };
};
interface ImmigrationDashboardProps {
  applications: Application[];
}
function decodeLocation(encodedLocation: string): string {
  try {
    return decodeURIComponent(encodedLocation);
  } catch (error) {
    console.error("Error decoding location:", error);
    return encodedLocation;
  }
}

const ImmigrationDashboard = ({ applications }: ImmigrationDashboardProps) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date();
  const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
  const fromDate =
    searchParams?.get("from") || format(thirtyDaysAgo, "yyyy-MM-dd");
  const toDate = searchParams?.get("to") || format(new Date(), "yyyy-MM-dd");

  const location = params?.location as string;
  const decodedLocation = decodeLocation(location);

  const handelSelect = (value: string) => {
    router.push(
      `/agent-platform/payment/immigration/${value}/from=${fromDate}&to=${toDate}`
    );
  };

  // Get unique creators from applications
  const { days15, days30 } = groupApplicationsByDuration(applications);
  const estimatedCost = applications.reduce(
    (sum, app) => sum + app.immigrationPrice,
    0
  );

  const actualCost = applications
    .filter((app) => app.stage === "Processed")
    .reduce((sum, app) => sum + (app.immigrationPrice || 0), 0);

  const currency = applications[0]?.immigrationCurrency || "USD";

  const totalPayment = applications.reduce(
    (sum, app) => sum + app.immigrationPrice,
    0
  );
  const totalApplications = applications.length;
  const averageCost = totalPayment / totalApplications;

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary rounded-t-lg">
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary-foreground">
            Immigration Dashboard
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="bg-primary-foreground rounded-lg">
              <Select value={decodedLocation} onValueChange={handelSelect}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hanoi">Hanoi</SelectItem>
                  <SelectItem value="Ho Chi Minh">Ho Chi Minh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-primary-foreground rounded-lg">
              <DatePickers />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estimated Cost
              </CardTitle>
              <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estimatedCost.toLocaleString()} {currency}
              </div>
              <p className="text-xs text-muted-foreground">
                Total from all applications
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actual Cost</CardTitle>
              <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {actualCost.toLocaleString()} {currency}
              </div>
              <p className="text-xs text-muted-foreground">
                From completed applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applications
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                Processed Applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Cost
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageCost.toFixed(2)} {currency}
              </div>
              <p className="text-xs text-muted-foreground">Per application</p>
            </CardContent>
          </Card>
        </div>
        <ImmigrationTable days={15} applications={days15} />
        <ImmigrationTable days={30} applications={days30} />
      </CardContent>
    </Card>
  );
};

export default ImmigrationDashboard;

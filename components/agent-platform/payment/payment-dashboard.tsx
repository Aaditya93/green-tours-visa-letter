"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BadgeDollarSign, Users, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { useState } from "react";
import { Application } from "@/app/schemas/types";
import Link from "next/link";
import { DatePickerWithRange } from "./date-range";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
interface SimplifiedCompany {
  name: string;
  id: string;
}
interface PaymentDashboard {
  applications: Application[];
  companies: SimplifiedCompany[];
}

const PaymentDashboard = ({ companies, applications }: PaymentDashboard) => {
  const [speedFilter, setSpeedFilter] = useState("all");

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const companyId = params?.companyId as string;
  const today = new Date();
  const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

  const fromDate =
    searchParams?.get("from") || format(thirtyDaysAgo, "yyyy-MM-dd");
  const toDate = searchParams?.get("to") || format(new Date(), "yyyy-MM-dd");

  interface SpeedColors {
    "1H": string;
    "2H": string;
    "4H": string;
    "8H": string;
    "1D": string;
    "2D": string;
    "3D": string;
    NO: string;
  }

  const getSpeedColor = (speed: keyof SpeedColors): string => {
    switch (speed) {
      case "1H":
        return "bg-red-500";
      case "2H":
        return "bg-red-300";
      case "4H":
        return "bg-red-200";
      case "8H":
        return "bg-yellow-400";
      case "1D":
        return "bg-blue-500";
      case "2D":
        return "bg-green-500";
      case "3D":
        return "bg-orange-300";
      case "NO":
        return "bg-white";
      default:
        return "bg-white";
    }
  };
  const handelSelect = (value: string) => {
    router.push(
      `/agent-platform/payment/${value}/from=${fromDate}&to=${toDate}`
    );
  };

  // Get unique creators from applications

  const estimatedCost = applications.reduce((sum, app) => sum + app.cost, 0);

  const actualCost = applications
    .filter((app) => app.stage === "Processed")
    .reduce((sum, app) => sum + app.cost, 0);

  const currency = applications[0]?.currency || "EUR";

  const totalPayment = applications.reduce((sum, app) => sum + app.cost, 0);
  const totalApplications = applications.length;
  const averageCost = totalPayment / totalApplications;

  const filteredApplications = applications.filter((app) =>
    speedFilter === "all" ? true : app.speed === speedFilter
  );

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary rounded-t-lg">
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary-foreground">
            Payment Dashboard
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="bg-primary-foreground rounded-lg">
              <Select value={companyId} onValueChange={handelSelect}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Company" />
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
            <DatePickerWithRange />
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

        <Card className="mt-4">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Applications Detail</CardTitle>
                <CardDescription>
                  A list of all Complete applications and their cost.
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={speedFilter} onValueChange={setSpeedFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Speeds</SelectItem>
                    <SelectItem value="1H">1 Hour</SelectItem>
                    <SelectItem value="2H">2 Hours</SelectItem>
                    <SelectItem value="4H">4 Hours</SelectItem>
                    <SelectItem value="8H">8 Hours</SelectItem>
                    <SelectItem value="1D">1 Day</SelectItem>
                    <SelectItem value="2D">2 Day</SelectItem>
                    <SelectItem value="3D">3 Day</SelectItem>
                    <SelectItem value="4D">4 Day</SelectItem>
                    <SelectItem value="NO">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Passport</TableHead>
                  <TableHead>Visa Type</TableHead>
                  <TableHead>Speed</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.code}>
                    <TableCell className="font-medium">{app.code}</TableCell>
                    <TableCell>{app.fullName}</TableCell>
                    <TableCell>{app.passportNumber}</TableCell>
                    <TableCell>{app.duration}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getSpeedColor(
                          app.speed as keyof SpeedColors
                        )} text-primary`}
                      >
                        {app.speed}
                      </Badge>
                    </TableCell>
                    <TableCell>{app.travelDuration} Days</TableCell>
                    <TableCell>{app.creator}</TableCell>
                    <TableCell>
                      <Badge
                        className={`
                         px-2 py-1 rounded-full text-xs 
                         ${
                           app.stage === "Not Processed"
                             ? "bg-yellow-100 text-yellow-800"
                             : app.stage === "Processing"
                             ? "bg-gray-100 text-gray-800"
                             : app.stage === "Processed"
                             ? "bg-green-100 text-green-800"
                             : app.stage === "Blacklist"
                             ? "bg-red-100 text-red-800"
                             : app.stage === "Overstayed"
                             ? "bg-blue-100 text-blue-500"
                             : ""
                         }
                       `}
                      >
                        {app.stage}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {app.currency} {app.cost}
                    </TableCell>
                    <TableCell>
                      <Link href={`/application/visa/${app.id}`}>View</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PaymentDashboard;

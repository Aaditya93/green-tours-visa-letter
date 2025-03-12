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
interface BillingDashboardProps {
  applications: Application[];
}
const BillingDashboard = ({ applications }: BillingDashboardProps) => {
  const [speedFilter, setSpeedFilter] = useState("all");

  interface SpeedType {
    speed: "1H" | "2H" | "4H" | "8H" | "1D" | "2D" | "3D" | "4D" | "Normal";
  }

  const getSpeedColor = (speed: SpeedType["speed"]): string => {
    switch (speed) {
      case "1H":
        return "bg-red-500";
      case "2H":
        return "bg-red-300";
      case "4H":
        return "bg-red-300";
      case "8H":
        return "bg-yellow-400";
      case "1D":
        return "bg-blue-500";
      case "2D":
        return "bg-green-500";
      case "3D":
        return "bg-orange-300";
      case "4D":
        return "bg-orange-500";
      case "Normal":
        return "bg-white";
      default:
        return "bg-white";
    }
  };
  const estimatedCost = applications.reduce((sum, app) => sum + app.cost, 0);

  const actualCost = applications
    .filter((app) => app.stage === "Processed")
    .reduce((sum, app) => sum + app.cost, 0);

  const currency = applications[0]?.currency || "EUR";

  const totalPayment = applications.reduce((sum, app) => sum + app.cost, 0);
  const totalApplications = applications.length;
  const averageCost = totalPayment / totalApplications;

  const filteredApplications =
    speedFilter === "all"
      ? applications
      : applications.filter((app) => app.speed === speedFilter);

  return (
    <Card className="w-full ">
      <CardHeader className="bg-primary rounded-t-lg ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary-foreground">
            Billing Dashboard
          </CardTitle>
          <DatePickerWithRange />
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
                Completed Applications
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
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Applications Detail</CardTitle>
                <CardDescription>
                  A list of all Complete applications and their cost.
                </CardDescription>
              </div>
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
                          app.speed as SpeedType["speed"]
                        )} text-primary`}
                      >
                        {app.speed}
                      </Badge>
                    </TableCell>
                    <TableCell>{app.travelDuration} Days</TableCell>
                    <TableCell>
                      <Badge
                        className={`
    px-2 py-1 rounded-full text-xs font-semibold
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
                      {app.currency} {app.cost}{" "}
                    </TableCell>
                    <TableCell>
                      <Link href={`/travel-agent/application/visa/${app.id}`}>
                        View
                      </Link>
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

export default BillingDashboard;

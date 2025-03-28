"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BadgeDollarSign, Users, CheckCircle, FileText } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Application } from "@/app/schemas/types";
import Link from "next/link";
import { DatePickerWithRange } from "./date-range";
import { format } from "date-fns";

interface SimplifiedCompany {
  name: string;
  id: string;
}

interface Bill {
  _id: string;
  amount: number;
  currency: string;
  payment: boolean;
  applicationIds: string[];
  companyId: string;
  companyName: string;
  createdDate: Date;
  companyAddress?: string;
  paymentDate?: Date;
}

interface PaymentDashboard {
  applications: Application[];
  companies: SimplifiedCompany[];
  bills: Bill[];
}

const BillingDashboard = ({ applications, bills }: PaymentDashboard) => {
  const t = useTranslations("agentPayment");

  // Calculate various metrics for applications
  const estimatedCost = applications.reduce((sum, app) => sum + app.cost, 0);

  // Calculate paid amount (applications with payment: true)
  const paidAmount = applications
    .filter((app) => app.payment === true)
    .reduce((sum, app) => sum + app.cost, 0);

  const deliveredApplications = applications.filter(
    (app) => app.stage === "Delivered"
  ).length;

  const currency = applications[0]?.currency || bills[0]?.currency || "EUR";

  const totalApplications = applications.length;

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary rounded-t-lg">
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary-foreground">
            {t("title1")}
          </CardTitle>
          <div className="flex items-center gap-4">
            <DatePickerWithRange />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Application Metrics */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("parameter1")}
              </CardTitle>
              <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estimatedCost.toLocaleString()} {currency}
              </div>
              <p className="text-xs text-muted-foreground">{t("subtitle1")}</p>
            </CardContent>
          </Card>

          {/* Amount Paid */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {" "}
                {t("parameter2")}
              </CardTitle>
              <CheckCircle className="h-4 w-4 " />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">
                {paidAmount.toLocaleString()} {currency}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="text-xs text-muted-foreground">
                  {t("subtitle2")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Amount */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("parameter3")}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">{t("subtitle3")}</p>
            </CardContent>
          </Card>

          {/* Delivered Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("parameter4")}
              </CardTitle>
              <CheckCircle className="h-4 w-4 " />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">{deliveredApplications}</div>
              <p className="text-xs ">
                {deliveredApplications > 0 && totalApplications > 0
                  ? Math.round(
                      (deliveredApplications / totalApplications) * 100
                    )
                  : 0}
                % {t("subtitle4")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bill List */}
        <Card className="mt-4">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>{t("heading")}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {bills.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill ID</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow key={bill._id}>
                      <TableCell className="font-medium">
                        {bill._id.toString().substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {format(new Date(bill.createdDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{bill.companyName}</TableCell>
                      <TableCell>{bill.applicationIds.length}</TableCell>
                      <TableCell>
                        {bill.amount.toLocaleString()} {bill.currency}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={bill.payment ? "outline" : "destructive"}
                          className={`px-2 py-1 text-xs`}
                        >
                          {bill.payment ? "Paid" : "Unpaid"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/travel-agent/bill/${bill._id}`}
                          className="text-primary hover:underline"
                        >
                          View Details
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>
                  No bills found for this company in the selected date range.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default BillingDashboard;

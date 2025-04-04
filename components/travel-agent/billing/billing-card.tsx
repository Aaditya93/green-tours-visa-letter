"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

        {/* Application Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-[1600px] mx-auto">
          <Card className="w-full">
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
          <Card className="w-full">
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
          <Card className="w-full">
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
          <Card className="w-full">
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
        <Card className="mt-4 shadow-sm">
          <CardHeader className="bg-muted/5 py-3 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <CardTitle className="text-lg">{t("heading")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            {bills.length > 0 ? (
              <div className="overflow-x-auto -mx-2">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center py-2 px-3">
                        {t("table.id")}
                      </TableHead>
                      <TableHead className="text-center py-2 px-3">
                        {t("table.createdDate")}
                      </TableHead>
                      <TableHead className="text-center py-2 px-3">
                        {t("table.applications")}
                      </TableHead>
                      <TableHead className="text-center py-2 px-3">
                        {t("table.amount")}
                      </TableHead>
                      <TableHead className="text-center py-2 px-3">
                        {t("table.status")}
                      </TableHead>
                      <TableHead className="text-center py-2 px-3">
                        {t("table.actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill) => (
                      <TableRow key={bill._id} className="hover:bg-muted/5">
                        <TableCell className="font-medium text-center py-2 px-3">
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs py-0.5 px-2"
                          >
                            {bill._id.toString().substring(0, 8)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center py-2 px-3">
                          {format(new Date(bill.createdDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-center py-2 px-3">
                          <Badge variant="outline" className="py-0.5 px-2">
                            {bill.applicationIds.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium py-2 px-3">
                          {bill.amount.toLocaleString()} {bill.currency}
                        </TableCell>
                        <TableCell className="text-center py-2 px-3">
                          {bill.payment ? (
                            <Badge
                              variant="outline"
                              className="px-2.5 py-0.5 bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                            >
                              {t("table.paid")}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="px-2.5 py-0.5 bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                            >
                              {t("table.unpaid")}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center py-2 px-3">
                          <Link
                            href={`/travel-agent/bill/${bill._id}`}
                            className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                          >
                            {t("table.view")}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-sm">{t("message")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default BillingDashboard;

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
import { useTranslations } from "next-intl";
import { Application } from "@/app/schemas/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import DatePickers from "./date-range";
import { SimplifiedCompany } from "@/actions/agent-platform/visa-letter";
import BillingTable from "./billing-table";

interface DurationGroups {
  days15: Application[];
  days30: Application[];
}

const groupApplicationsByDuration = (
  applications: Application[]
): DurationGroups => {
  return {
    days15: applications.filter(
      (app) => app.travelDuration === 15 && app.stage === "Processed"
    ),
    days30: applications.filter(
      (app) => app.travelDuration === 30 && app.stage === "Processed"
    ),
  };
};
interface BillingDashboardProps {
  applications: Application[];
  companies: SimplifiedCompany[];
}

const Billing = ({ companies, applications }: BillingDashboardProps) => {
  const t = useTranslations("adminBilling");
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date();
  const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
  const fromDate =
    searchParams?.get("from") || format(thirtyDaysAgo, "yyyy-MM-dd");
  const toDate = searchParams?.get("to") || format(new Date(), "yyyy-MM-dd");
  const companyId = params?.companyId as string;
  const handelSelect = (value: string) => {
    router.push(
      `/agent-platform/billing/${value}/from=${fromDate}&to=${toDate}`
    );
  };

  // Get unique creators from applications
  const { days15, days30 } = groupApplicationsByDuration(applications);
  const estimatedCost = applications.reduce((sum, app) => sum + app.cost, 0);

  const actualCost = applications
    .filter((app) => app.stage === "Processed")
    .reduce((sum, app) => sum + (app.cost || 0), 0);

  const currency = applications[0]?.currency || "USD";

  const totalPayment = applications.reduce((sum, app) => sum + app.cost, 0);
  const totalApplications = applications.length;
  const averageCost = totalPayment / totalApplications;

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary rounded-t-lg">
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary-foreground">
            {t("title1")}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="bg-primary-foreground rounded-lg">
              <Select
                value={companyId}
                onValueChange={handelSelect}
                defaultValue={companies[0]?.id}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    {companies.find((c) => c.id === companyId)?.name ||
                      t("selectCompany")}
                  </SelectValue>
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
                {t("parameter1")}
              </CardTitle>
              <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estimatedCost} {currency}
              </div>
              <p className="text-xs text-muted-foreground">{t("subtitle1")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {" "}
                {t("parameter2")}
              </CardTitle>
              <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {actualCost.toLocaleString()} {currency}
              </div>
              <p className="text-xs text-muted-foreground">{t("subtitle2")}</p>
            </CardContent>
          </Card>

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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("parameter4")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageCost.toFixed(2)} {currency}
              </div>
              <p className="text-xs text-muted-foreground"> {t("subtitle4")}</p>
            </CardContent>
          </Card>
        </div>
        <BillingTable days={15} applications={days15} />
        <BillingTable days={30} applications={days30} />
      </CardContent>
    </Card>
  );
};

export default Billing;

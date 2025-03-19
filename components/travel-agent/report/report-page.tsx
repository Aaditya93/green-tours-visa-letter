import { DatePickerWithRange } from "./data-range";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TbPresentationAnalytics } from "react-icons/tb";
import { Application } from "@/app/schemas/types";
import { MainLineChart } from "@/components/report/main-bar-chart";
import {
  DataMainLineChart,
  DataSpeedChart,
  DataUserBarChart,
} from "@/components/report/data";
import { getTranslations } from "next-intl/server";
import { UserBarChart } from "@/components/report/user-bar-chart";
import { CountryChart } from "@/components/report/country-chart";
import { DataPieChartCountry } from "@/components/report/data-country";
import { SpeedChart } from "./speed-chart";
interface ReportPageProps {
  Application: Application[];
}

const ReportPage = async ({ Application }: ReportPageProps) => {
  const LineChart = DataMainLineChart(Application);
  const barchart = DataUserBarChart(Application);
  const pieChart = DataPieChartCountry(Application);
  const t = await getTranslations("travelReport");

  const speedChart = DataSpeedChart(Application);

  return (
    <div className="container mx-auto  ">
      <Card className="w-full ">
        <CardHeader className=" border-b p-4 sm:p-3 bg-primary rounded-t-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <CardTitle className="flex items-center text-xl font-bold text-center sm:text-left text-primary-foreground">
              <TbPresentationAnalytics className="mr-2 w-8 h-8 text-primary-foreground" />
              {t("title")}
            </CardTitle>
            <DatePickerWithRange />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <MainLineChart data={LineChart} />
          <div className=" flex-col grid grid-cols-2   pt-0">
            <UserBarChart data={barchart} />
            <CountryChart data={pieChart} />
          </div>
          <div className="   pt-0">
            <SpeedChart data={speedChart} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;

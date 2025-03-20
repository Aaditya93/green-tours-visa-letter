import { DatePickerWithRange } from "./data-range";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TbPresentationAnalytics } from "react-icons/tb";
import { Application } from "@/app/schemas/types";
import { MainLineChart } from "./main-bar-chart";
import {
  DataMainLineChart,
  DataSpeedChart,
  StaffChartData,
  TravelAgentChartData,
} from "./data";
import { CountryChart } from "./country-chart";
import { DataPieChartCountry } from "./data-country";
import { SpeedChart } from "./speed-chart";
import { TravelAgentChart } from "./travel-agent";
import { SimplifiedCompany } from "@/actions/agent-platform/visa-letter";
import { StaffChart } from "./staff-chart";
import { getTranslations } from "next-intl/server";

interface ReportPageProps {
  Application: Application[];
  companies: SimplifiedCompany[];
  clientList: ClientData[];
}
interface ClientData {
  agentId: string;
  clients: string[];
}

const ReportPage = async ({
  clientList,
  companies,
  Application,
}: ReportPageProps) => {
  const LineChart = DataMainLineChart(Application);
  const pieChart = DataPieChartCountry(Application);
  const speedChart = DataSpeedChart(Application);
  const travelAgentChart = TravelAgentChartData(Application, companies);
  const staffChart = StaffChartData(Application, clientList);
  const t = await getTranslations("report");
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
            <CountryChart data={pieChart} />
            <SpeedChart data={speedChart} />
          </div>
          <div className=" flex-col grid grid-cols-2   pt-0">
            <TravelAgentChart data={travelAgentChart} />
            <StaffChart data={staffChart} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;

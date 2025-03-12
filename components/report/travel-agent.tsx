"use client";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CompanyData {
  companyName: string;
  TotalApplications: number;
}
const chartConfig = {
  TotalApplications: {
    label: "Total Applications",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const TravelAgentChart = ({ data }: { data: CompanyData[] }) => {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Travel Agent</CardTitle>
        <CardDescription>Showing Applications Per Travel Agent</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="companyName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="TotalApplications"
              fill="var(--color-TotalApplications)"
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

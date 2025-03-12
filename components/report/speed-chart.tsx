"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SpeedData {
  speed: string;
  Applications: number;
  fill: string;
}
const chartConfig = {
  Applications: {
    label: "Total Applications",
  },
  "4H": {
    label: "4 Hours",
  },
  "8H": {
    label: "8 Hours",
  },
  "1D": {
    label: "1 Day",
  },
  "3D": {
    label: "3 Days",
  },
  NO: {
    label: "Normal",
  },
} satisfies ChartConfig;

export const SpeedChart = ({ data }: { data: SpeedData[] }) => {
  return (
    <Card className="rounded-none ">
      <CardHeader>
        <CardTitle>Speed Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 0,
            }}
            className="h-64 w-full"
          >
            <YAxis
              dataKey="speed"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="Applications" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="Applications" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

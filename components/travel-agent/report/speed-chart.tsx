"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { useTranslations } from "next-intl";
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

export const SpeedChart = ({ data }: { data: SpeedData[] }) => {
  const t = useTranslations("travelReport.speedChart");
  const chartConfig = {
    Applications: {
      label: t("label"),
    },
    "4H": {
      label: t("4hours"),
    },
    "8H": {
      label: t("8hours"),
    },
    "1D": {
      label: t("1day"),
    },
    "3D": {
      label: t("3days"),
    },
    NO: {
      label: t("normal"),
    },
  } satisfies ChartConfig;
  return (
    <Card className="rounded-none ">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
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

"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {
  TotalApplication: {
    label: "Total Application",
    color: "hsl(var(--chart-1))",
  },
 
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig
interface DurationData {
  HandleBy: string;
  TotalApplication: number;
}
export function HandleByChart({ data }: { data: DurationData[] }) {
 
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Handle By</CardTitle>
        <CardDescription>Showing Handle By Application </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="HandleBy"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 12)}
              hide
            />
            <XAxis dataKey="TotalApplication" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="TotalApplication"
              layout="vertical"
              fill="var(--color-TotalApplication)"
              radius={4}
            >
              <LabelList
                dataKey="HandleBy"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="TotalApplication"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  )
}

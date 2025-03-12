
"use client";

import { Label, Pie, PieChart } from "recharts"
import React from "react";
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
  visitors: {
    label: "Visitors",
  },
  
 
} satisfies ChartConfig
interface CountryData {
    Country: string;
    TotalApplication: number;
    fill: string;
  }
  
export const CountryChart = ({data}:{data: CountryData[]}) =>{
  
   const total = React.useMemo(
      () => ({
        total: data?.reduce((acc, curr) => acc + curr.TotalApplication, 0) || 0,
      }),
      [data]
    );

  return (
    <Card className="flex flex-col rounded-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Country</CardTitle>
        <CardDescription>Showing Applications Per Country</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}

          className="mx-auto aspect-square max-h-[340px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              color="fill"
              dataKey="TotalApplication"
              nameKey="Country"
              innerRadius={80}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                        Total Application
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
     
    </Card>
  )
}

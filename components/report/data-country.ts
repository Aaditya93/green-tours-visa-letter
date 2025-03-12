import { Application } from "@/app/schemas/types";

  type ChartData = {
    Country: string;
    TotalApplication: number;
    fill: string;
  }[];
  
export function DataPieChartCountry(
    data: Application[],
    topN: number = 10
  ): ChartData {
    const countryCount: Record<string, number> = {};

  
    // Count applications per country
    data.forEach(({ nationalityCurrent }) => {
      if (nationalityCurrent) {
        countryCount[nationalityCurrent] =
          (countryCount[nationalityCurrent] || 0) + 1;
      }
    });
  
    // Sort countries by application count in descending order
    const sortedCountries = Object.entries(countryCount).sort(
      (a, b) => b[1] - a[1]
    );
  
    // Take top N countries, combine the rest into "Other"
    const topCountries = sortedCountries.slice(0, topN);
    const otherCountries = sortedCountries.slice(topN);
  
    const chartData: ChartData = topCountries.map(([country, count],index) => ({
      Country: country,
  
      TotalApplication: count,
      fill: `hsl(var(--chart-${index+1}))`,
    }));
  
    if (otherCountries.length > 0) {
      const otherTotal = otherCountries.reduce(
        (sum, [, count]) => sum + count,
        0
      );
      chartData.push({
        Country: "Other",
        TotalApplication: otherTotal,
        fill: "hsl(var(--chart-11))",
      });
    }
  
    return chartData;
  }
  
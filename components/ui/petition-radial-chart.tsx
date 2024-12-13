"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

// Define the chart configuration
const chartConfig = {
  signers: {
    label: "Signatures",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Define the prop types for the VotesChart component
interface VotesChartProps {
  chartData: {
    browser: string;
    signers: number;
    fill: string;
  }[];
}

// Define the VotesChart component
export function VotesChart({ chartData }: VotesChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square w-full h-full max-w-[250px] max-h-[250px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={270}
        endAngle={Math.round((chartData[0].signers / 150) * 360) + 270}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-transparent"
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey="signers" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                      className="fill-foreground text-4xl font-bold"
                    >
                      {chartData[0].signers.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Signers
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}

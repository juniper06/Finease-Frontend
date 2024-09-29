"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useToast } from "@/components/ui/use-toast";
import {
  getAllExpenses,
  getAllPaymentRecords,
  getAllProjectRecords,
} from "@/actions/ceo/graphs.action";

const initialChartData = [{ runway: 0, fill: "var(--color-runway)" }];

const chartConfig = {
  runway: {
    label: "Runway (months)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface TotalForecastingProps {
  startupId: number;
}

export function FinancialForecasting({ startupId }: TotalForecastingProps) {
  const { toast } = useToast();
  const [chartData, setChartData] = useState(initialChartData);
  const [totalRunway, setTotalRunway] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [expenses, payments, projects] = await Promise.all([
        getAllExpenses(startupId),
        getAllPaymentRecords(startupId),
        getAllProjectRecords(startupId),
      ]);

      if (expenses.error || payments.error || projects.error) {
        throw new Error("Error fetching financial data");
      }

      // Process regular expenses
      const expenseData = expenses.reduce((acc, expense) => {
        const month = new Date(expense.createdAt).getMonth();
        acc[month] = (acc[month] || 0) + parseFloat(expense.amount);
        return acc;
      }, Array(12).fill(0));

      // Process project expenses
      const projectExpenseData = projects.reduce((acc, project) => {
        const month = new Date(project.createdAt).getMonth();
        acc[month] = (acc[month] || 0) + parseFloat(project.totalExpenses || 0);
        return acc;
      }, Array(12).fill(0));

      // Combine regular and project expenses
      const totalExpenseData = expenseData.map(
        (expense, index) => expense + projectExpenseData[index]
      );

      // Process payments (revenues)
      const paymentData = payments.reduce((acc, payment) => {
        const month = new Date(payment.createdAt).getMonth();
        acc[month] = (acc[month] || 0) + parseFloat(payment.totalAmount);
        return acc;
      }, Array(12).fill(0));

      // Calculate monthly net income (revenue - expenses)
      const monthlyNet = paymentData.map(
        (revenue, index) => revenue - totalExpenseData[index]
      );
      const totalFunds = monthlyNet.reduce((acc, net) => acc + net, 0);

      // Calculate the average monthly burn rate
      const averageMonthlyBurnRate =
        totalExpenseData.reduce((a, b) => a + b, 0) / 12;
      const calculatedTotalRunway = Number(
        (totalFunds / averageMonthlyBurnRate).toFixed(2)
      );

      setChartData([
        { runway: calculatedTotalRunway, fill: "var(--color-runway)" },
      ]);
      setTotalRunway(calculatedTotalRunway);
    } catch (error) {
      console.error("Failed to fetch financial data", error);
      toast({
        title: "Error",
        description: "Failed to fetch financial data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [startupId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Financial Forecasting</CardTitle>
        <CardDescription>Runway Projection</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadialBarChart
              data={chartData}
              endAngle={100}
              innerRadius={80}
              outerRadius={140}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar dataKey="runway" background />
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
                            {totalRunway.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Runway (months)
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total runway based on average monthly burn rate
        </div>
      </CardFooter>
    </Card>
  );
}

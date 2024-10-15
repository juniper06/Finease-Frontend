"use client";
import { useEffect, useState, useCallback } from "react";
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
  getAllProjects,
} from "@/actions/ceo/dashboard.action";
import { getUserData } from "@/actions/auth/user.action";

const initialChartData = [{ runway: 0, fill: "var(--color-runway)" }];

const chartConfig = {
  runway: {
    label: "Runway (months)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function FinancialForecasting() {
  const { toast } = useToast();
  const [chartData, setChartData] = useState(initialChartData);
  const [totalRunway, setTotalRunway] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const [expenses, payments, projects] = await Promise.all([
        getAllExpenses(user.id),
        getAllPaymentRecords(user.id),
        getAllProjects(user.id),
      ]);

      // Initialize arrays for each month
      const expenseData = Array(12).fill(0);
      const paymentData = Array(12).fill(0);
      const projectExpenseData = Array(12).fill(0);

      // Process expenses
      if (Array.isArray(expenses)) {
        expenses.forEach((expense) => {
          const month = new Date(expense.createdAt).getMonth();
          expenseData[month] += parseFloat(expense.amount);
        });
      }

      // Process payments
      if (Array.isArray(payments)) {
        payments.forEach((payment) => {
          const month = new Date(payment.createdAt).getMonth();
          paymentData[month] += parseFloat(payment.totalAmount);
        });
      }

      // Process project expenses
      if (Array.isArray(projects)) {
        projects.forEach((project) => {
          const month = new Date(project.createdAt).getMonth();
          projectExpenseData[month] += parseFloat(project.amount || "0");
        });
      }

      // Combine regular expenses and project expenses
      const totalExpenseData = expenseData.map(
        (expense, index) => expense + projectExpenseData[index]
      );

      const monthlyNet = paymentData.map(
        (revenue, index) => revenue - totalExpenseData[index]
      );
      const totalFunds = monthlyNet.reduce((acc, net) => acc + net, 0);

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
    } finally {
      setLoading(false);
    }
  }, [toast]);

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
          Showing total runway based on average monthly burn rate (including
          project expenses)
        </div>
      </CardFooter>
    </Card>
  );
}

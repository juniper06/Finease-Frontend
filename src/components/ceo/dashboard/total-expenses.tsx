"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getUserData } from "@/actions/auth/user.action";
import { useToast } from "@/components/ui/use-toast";
import { ChartConfig } from "@/components/ui/chart";
import { formatNumber } from "@/lib/utils";
import { getAllExpenses, getAllProjects } from "@/actions/ceo/dashboard.action";

const initialChartData = [
  { month: "January", expenses: 0 },
  { month: "February", expenses: 0 },
  { month: "March", expenses: 0 },
  { month: "April", expenses: 0 },
  { month: "May", expenses: 0 },
  { month: "June", expenses: 0 },
  { month: "July", expenses: 0 },
  { month: "August", expenses: 0 },
  { month: "September", expenses: 0 },
  { month: "October", expenses: 0 },
  { month: "November", expenses: 0 },
  { month: "December", expenses: 0 },
];

const chartConfig = {
  expenses: {
    label: "Total Expenses",
    color: "#8884d8",
  },
} satisfies ChartConfig;

export default function TotalExpenses() {
  const { toast } = useToast();
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(initialChartData);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (error) {
        toast({
          description: "Failed to fetch user data.",
        });
      }
    }
    fetchUserData();
  }, [toast]);

  useEffect(() => {
    async function fetchExpensesAndProjects() {
      if (!user) return;
      setIsLoading(true);
      try {
        const [expensesResult, projectsResult] = await Promise.all([
          getAllExpenses(user.id),
          getAllProjects(user.id),
        ]);

        // Check if results are arrays
        if (!Array.isArray(expensesResult) || !Array.isArray(projectsResult)) {
          throw new Error(
            (expensesResult as any).error ||
              (projectsResult as any).error ||
              "Unknown error"
          );
        }

        const expenses = expensesResult;
        const projects = projectsResult;

        const monthlyData = initialChartData.map((monthData, index) => {
          const monthExpenses = expenses
            .filter(
              (expense: any) => new Date(expense.createdAt).getMonth() === index
            )
            .reduce(
              (acc: number, expense: any) => acc + parseFloat(expense.amount),
              0
            );

          const monthProjectExpenses = projects
            .filter(
              (project: any) => new Date(project.createdAt).getMonth() === index
            )
            .reduce(
              (acc: number, project: any) => acc + parseFloat(project.amount),
              0
            );

          const totalMonthExpenses = monthExpenses + monthProjectExpenses;
          return { ...monthData, expenses: totalMonthExpenses };
        });

        // Get the current month
        const currentMonth = new Date().getMonth();

        // Reset current month expenses to 0 if there are no data
        if (monthlyData[currentMonth]?.expenses === undefined) {
          monthlyData[currentMonth].expenses = 0;
        }

        setMonthlyExpenses(monthlyData);

        // Calculate total expenses for the year
        const totalYearExpenses = monthlyData.reduce(
          (acc, month) => acc + month.expenses,
          0
        );

        setTotalExpenses(monthlyData[currentMonth]?.expenses || 0); // Current month's expenses
      } catch (error) {
        console.error("Failed to fetch expenses data:", error);
        setMonthlyExpenses(initialChartData);
        setTotalExpenses(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExpensesAndProjects();
  }, [user, toast]);

  return (
    <Card x-chunk="dashboard-01-chunk-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? "Loading..." : `- ${formatNumber(totalExpenses)}`}
        </div>
      </CardContent>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip formatter={(value) => `${formatNumber(Number(value))}`} />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="leading-none text-muted-foreground">
          Monthly Total Expenses (Regular + Project)
        </div>
      </CardFooter>
    </Card>
  );
}

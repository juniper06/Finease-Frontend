"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getUserData } from "@/actions/auth/user.action";
import { useToast } from "@/components/ui/use-toast";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatNumber } from "@/lib/utils";
import { getAllExpenses } from "@/actions/cfo/expenses.action";
import { getAllProjects } from "@/actions/cfo/project.action";

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
    label: "Expenses",
    color: "#8884d8",
  },
} satisfies ChartConfig;

export default function TotalExpenses() {
  const { toast } = useToast();
  const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState(initialChartData);
  const [user, setUser] = useState<any>(null);

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
      try {
        const [expenses, projects] = await Promise.all([
          getAllExpenses(user.id),
          getAllProjects(user.id)
        ]);
        
        const monthlyData = initialChartData.map((monthData, index) => {
          const monthExpenses = expenses
            .filter((expense: any) => new Date(expense.createdAt).getMonth() === index)
            .reduce((acc: number, expense: any) => acc + parseFloat(expense.amount), 0);
          
          const monthProjectExpenses = projects
            .filter((project: any) => new Date(project.createdAt).getMonth() === index)
            .reduce((acc: number, project: any) => acc + parseFloat(project.totalExpenses || 0), 0);
          
          const totalMonthExpenses = monthExpenses + monthProjectExpenses;
          return { ...monthData, expenses: totalMonthExpenses };
        });

        setMonthlyExpenses(monthlyData);
        const currentMonth = new Date().getMonth();
        const currentMonthExpenses = monthlyData[currentMonth]?.expenses || 0;
        setTotalExpenses(currentMonthExpenses);
        
      } catch (error) {
        toast({
          description: "Failed to fetch expenses and projects data.",
        });
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
          {totalExpenses !== null ? `- ₱${formatNumber(totalExpenses.toFixed(2))}` : "Loading..."}
        </div>
      </CardContent>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={(value) => value.slice(0, 3)} />
            <Tooltip formatter={(value) => `₱${formatNumber(value)}`} />
            <Line type="monotone" dataKey="expenses" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="leading-none text-muted-foreground">
          Monthly Expenses Data
        </div>
      </CardFooter>
    </Card>
  );
}

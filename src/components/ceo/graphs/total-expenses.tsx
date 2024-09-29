import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/components/ui/use-toast";
import { formatNumber } from "@/lib/utils";
import { getAllExpenses, getAllProjectRecords } from "@/actions/ceo/graphs.action";

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

interface TotalExpensesProps {
  startupId: number;
}

export default function TotalExpenses({ startupId }: TotalExpensesProps) {
  const { toast } = useToast();
  const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState(initialChartData);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const [expenses, projects] = await Promise.all([
          getAllExpenses(startupId),
          getAllProjectRecords(startupId),
        ]);

        const monthlyData = initialChartData.map((monthData, index) => {
          // Calculate regular expenses for each month
          const monthExpenses = expenses
            .filter((expense: any) => new Date(expense.createdAt).getMonth() === index)
            .reduce((acc: number, expense: any) => acc + parseFloat(expense.amount), 0);

          // Calculate project expenses for each month
          const projectExpenses = projects
            .filter((project: any) => new Date(project.createdAt).getMonth() === index)
            .reduce((acc: number, project: any) => acc + parseFloat(project.totalExpenses || 0), 0);

          // Combine both regular and project expenses
          return { ...monthData, expenses: monthExpenses + projectExpenses };
        });

        setMonthlyExpenses(monthlyData);

        // Set total expenses for the current month
        const currentMonth = new Date().getMonth();
        const currentMonthExpenses = monthlyData[currentMonth]?.expenses || 0;
        setTotalExpenses(currentMonthExpenses);
      } catch (error) {
        toast({
          description: "Failed to fetch expenses data.",
        });
      }
    }

    fetchExpenses();
  }, [startupId, toast]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {totalExpenses !== null ? `- ₱${formatNumber(totalExpenses)}` : "Loading..."}
        </div>
      </CardContent>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={(value) => value.slice(0, 3)} />
            <Tooltip formatter={(value) => `${formatNumber(Number(value))}`} />
            <Line type="monotone" dataKey="expenses" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="leading-none text-muted-foreground">Monthly Expenses Data</div>
      </CardFooter>
    </Card>
  );
}

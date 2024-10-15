"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { getAllPaymentRecords } from "@/actions/ceo/dashboard.action";
import { formatNumber } from "@/lib/utils";

const initialChartData = [
  { month: "January", sales: 0 },
  { month: "February", sales: 0 },
  { month: "March", sales: 0 },
  { month: "April", sales: 0 },
  { month: "May", sales: 0 },
  { month: "June", sales: 0 },
  { month: "July", sales: 0 },
  { month: "August", sales: 0 },
  { month: "September", sales: 0 },
  { month: "October", sales: 0 },
  { month: "November", sales: 0 },
  { month: "December", sales: 0 },
];

export default function TotalSales() {
  const { toast } = useToast();
  const [totalSales, setTotalSales] = useState<number>(0); // Default to 0
  const [monthlySales, setMonthlySales] = useState(initialChartData);
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
    async function fetchPaymentRecords() {
      if (!user) return;
      try {
        const payments = await getAllPaymentRecords(user.id);

        // Check if payments is an array before processing
        const monthlyData = initialChartData.map((monthData, index) => {
          const monthSales = Array.isArray(payments)
            ? payments
                .filter((payment: any) => new Date(payment.createdAt).getMonth() === index)
                .reduce((acc: number, payment: any) => acc + parseFloat(payment.totalAmount), 0)
            : 0; // Default to 0 if payments is not an array

          return { ...monthData, sales: monthSales };
        });

        setMonthlySales(monthlyData);

        const currentMonth = new Date().getMonth();
        const currentMonthSales = monthlyData[currentMonth]?.sales || 0;
        setTotalSales(currentMonthSales);
      } catch (error) {
        setMonthlySales(initialChartData);
        setTotalSales(0);
      }
    }
    fetchPaymentRecords();
  }, [user, toast]);

  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        <span className="h-4 w-4 text-muted-foreground">₱</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {totalSales !== null ? `+ ${formatNumber(totalSales)}` : "Loading..."}
        </div>
      </CardContent>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={(value) => value.slice(0, 3)} />
            <Tooltip formatter={(value) => `${formatNumber(Number(value))}`} />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="leading-none text-muted-foreground">Monthly Sales Data</div>
      </CardFooter>
    </Card>
  );
}

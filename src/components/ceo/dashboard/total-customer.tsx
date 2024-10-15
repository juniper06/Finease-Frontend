"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
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
import { getAllCustomers } from "@/actions/ceo/dashboard.action";
import { formatNumber } from "@/lib/utils";

const initialChartData = [
  { month: "January", customers: 0 },
  { month: "February", customers: 0 },
  { month: "March", customers: 0 },
  { month: "April", customers: 0 },
  { month: "May", customers: 0 },
  { month: "June", customers: 0 },
  { month: "July", customers: 0 },
  { month: "August", customers: 0 },
  { month: "September", customers: 0 },
  { month: "October", customers: 0 },
  { month: "November", customers: 0 },
  { month: "December", customers: 0 },
];

export default function TotalCustomer() {
  const { toast } = useToast();
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [monthlyCustomers, setMonthlyCustomers] = useState(initialChartData);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast({
          description: "Failed to fetch user data.",
        });
      }
    }
    fetchUserData();
  }, [toast]);

  useEffect(() => {
    async function fetchCustomers() {
      if (!user) return;
      setIsLoading(true);
      try {
        const customers = await getAllCustomers(user.id);

        if (Array.isArray(customers)) {
          const monthlyData = initialChartData.map((monthData, index) => {
            const monthCustomers = customers.filter(
              (customer: any) => new Date(customer.createdAt).getMonth() === index
            ).length;
            return { ...monthData, customers: monthCustomers };
          });

          setMonthlyCustomers(monthlyData);

          const currentMonth = new Date().getMonth();
          const currentMonthCustomers = monthlyData[currentMonth]?.customers || 0;
          setTotalCustomers(currentMonthCustomers);
        } else {
          console.error("Unexpected customers data format:", customers);
          setMonthlyCustomers(initialChartData);
          setTotalCustomers(0);
        }
      } catch (error) {
        console.error("Failed to fetch customers data:", error);
        setMonthlyCustomers(initialChartData);
        setTotalCustomers(0);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomers();
  }, [user, toast]);

  return (
    <Card x-chunk="dashboard-01-chunk-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? "Loading..." : `+ ${(totalCustomers)}`}
        </div>
      </CardContent>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyCustomers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip formatter={(value) => `${Number(value)}`} />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="leading-none text-muted-foreground">
          Monthly Customers Data
        </div>
      </CardFooter>
    </Card>
  );
}
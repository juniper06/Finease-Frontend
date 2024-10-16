"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";
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
import { getAllItems } from "@/actions/ceo/dashboard.action";
import { formatNumber } from "@/lib/utils";

const initialChartData = [
  { month: "January", items: 0 },
  { month: "February", items: 0 },
  { month: "March", items: 0 },
  { month: "April", items: 0 },
  { month: "May", items: 0 },
  { month: "June", items: 0 },
  { month: "July", items: 0 },
  { month: "August", items: 0 },
  { month: "September", items: 0 },
  { month: "October", items: 0 },
  { month: "November", items: 0 },
  { month: "December", items: 0 },
];

export default function TotalItems() {
  const { toast } = useToast();
  const [totalItems, setTotalItems] = useState<number>(0);
  const [monthlyItems, setMonthlyItems] = useState(initialChartData);
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
    async function fetchItems() {
      if (!user) return;
      setIsLoading(true);
      try {
        const items = await getAllItems(user.id);

        if (Array.isArray(items)) {
          const monthlyData = initialChartData.map((monthData, index) => {
            const monthItems = items.filter(
              (item: any) => new Date(item.createdAt).getMonth() === index
            ).length;
            return { ...monthData, items: monthItems };
          });

          setMonthlyItems(monthlyData);

          const currentMonth = new Date().getMonth();
          const currentMonthItems = monthlyData[currentMonth]?.items || 0;
          setTotalItems(currentMonthItems);
        } else {
          console.error("Unexpected items data format:", items);
          setMonthlyItems(initialChartData);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Failed to fetch items data:", error);
        setMonthlyItems(initialChartData);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    }
    fetchItems();
  }, [user, toast]);

  return (
    <Card x-chunk="dashboard-01-chunk-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? "Loading..." : `+ ${totalItems}`}
        </div>
      </CardContent>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyItems}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip formatter={(value) => `${value}`} />
            <Line
              type="monotone"
              dataKey="items"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="leading-none text-muted-foreground">
          Monthly items Data
        </div>
      </CardFooter>
    </Card>
  );
}

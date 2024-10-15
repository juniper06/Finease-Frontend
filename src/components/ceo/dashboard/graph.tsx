"use client"
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";
import { getUserData } from "@/actions/auth/user.action";
import { useToast } from "@/components/ui/use-toast";
import { formatNumber } from "@/lib/utils";
import {
  getAllExpenses,
  getAllPaymentRecords,
  getAllProjects,
} from "@/actions/ceo/dashboard.action";

interface GraphData {
  name: string;
  expenses: number;
  sales: number;
}

export function TotalGraph() {
  const { toast } = useToast();
  const [data, setData] = useState<GraphData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const user = await getUserData();
      const [expenses, payments, projects] = await Promise.all([
        getAllExpenses(user.id),
        getAllPaymentRecords(user.id),
        getAllProjects(user.id),
      ]);

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const expenseData = new Array(12).fill(0);
      const paymentData = new Array(12).fill(0);

      // Process expenses
      if (Array.isArray(expenses)) {
        expenses.forEach((expense) => {
          const month = new Date(expense.createdAt).getMonth();
          expenseData[month] += parseFloat(expense.amount);
        });
      }

      // Process projects and add to expenses
      if (Array.isArray(projects)) {
        projects.forEach((project) => {
          const month = new Date(project.createdAt).getMonth();
          expenseData[month] += parseFloat(project.amount || "0");
        });
      }

      // Process payments
      if (Array.isArray(payments)) {
        payments.forEach((payment) => {
          const month = new Date(payment.createdAt).getMonth();
          paymentData[month] += parseFloat(payment.totalAmount);
        });
      }

      // Prepare graph data
      const graphData: GraphData[] = monthNames.map((month, index) => ({
        name: month,
        expenses: expenseData[index],
        sales: paymentData[index],
      }));

      const currentMonth = new Date().getMonth();
      const currentTotalExpenses = expenseData[currentMonth];
      const currentTotalSales = paymentData[currentMonth];

      setData(graphData);
      setTotalExpenses(currentTotalExpenses);
      setTotalSales(currentTotalSales);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderCustomLegend = () => (
    <div style={{ textAlign: "right" }}>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <div
          style={{
            backgroundColor: "#ff4d4f",
            width: "10px",
            height: "10px",
            marginRight: "10px",
          }}
        ></div>
        <span>Total Expenses</span>
      </div>
      <div style={{ marginBottom: "10px" }}>
        {formatNumber(parseFloat(totalExpenses.toFixed(2)))}
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <div
          style={{
            backgroundColor: "#4caf50",
            width: "10px",
            height: "10px",
            marginRight: "10px",
          }}
        ></div>
        <span>Total Sales</span>
      </div>
      <div>{formatNumber(parseFloat(totalSales.toFixed(2)))}</div>
    </div>
  );

  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Sales and Expenses</CardTitle>
      </CardHeader>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${formatNumber(value)}`}
          />
          <Tooltip formatter={(value) => `${formatNumber(Number(value))}`} />
          <Legend
            verticalAlign="top"
            align="right"
            layout="vertical"
            content={renderCustomLegend}
          />
          <Bar
            dataKey="expenses"
            fill="#ff4d4f"
            radius={[4, 4, 0, 0]}
            name="Total Expenses"
          />
          <Bar
            dataKey="sales"
            fill="#4caf50"
            radius={[4, 4, 0, 0]}
            name="Total Sales"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

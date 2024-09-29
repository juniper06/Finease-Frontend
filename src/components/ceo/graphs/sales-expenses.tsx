"use client";

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
  getAllProjectRecords,
} from "@/actions/ceo/graphs.action";

interface TotalDifferenceProps {
  startupId: number;
}

export function TotalGraph({ startupId }: TotalDifferenceProps) {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const user = await getUserData();
      const [expenses, payments, projects] = await Promise.all([
        getAllExpenses(startupId),
        getAllPaymentRecords(startupId),
        getAllProjectRecords(startupId),
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

      const expenseData = expenses.reduce((acc, expense) => {
        const month = new Date(expense.createdAt).getMonth();
        if (!acc[month]) acc[month] = 0;
        acc[month] += parseFloat(expense.amount);
        return acc;
      }, new Array(12).fill(0));

      // Include project expenses
      projects.forEach((project) => {
        const month = new Date(project.createdAt).getMonth();
        expenseData[month] += parseFloat(project.totalExpenses || 0);
      });

      const paymentData = payments.reduce((acc, payment) => {
        const month = new Date(payment.createdAt).getMonth();
        if (!acc[month]) acc[month] = 0;
        acc[month] += parseFloat(payment.totalAmount);
        return acc;
      }, new Array(12).fill(0));

      const graphData = monthNames.map((month, index) => ({
        name: month,
        expenses: expenseData[index] || 0,
        sales: paymentData[index] || 0,
      }));

      const currentMonth = new Date().getMonth();
      const totalExpenses = expenseData[currentMonth] || 0;
      const totalSales = paymentData[currentMonth] || 0;

      setData(graphData);
      setTotalExpenses(totalExpenses);
      setTotalSales(totalSales);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
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
        ₱{formatNumber(totalExpenses.toFixed(2))}
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
      <div>₱{formatNumber(totalSales.toFixed(2))}</div>
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
            tickFormatter={(value) => `₱${formatNumber(value)}`}
          />
          <Tooltip formatter={(value) => `₱${formatNumber(value)}`} />
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

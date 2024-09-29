"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllUser, getUserData } from "@/actions/auth/user.action";
import { useToast } from "@/components/ui/use-toast";
import { formatNumber } from "@/lib/utils";
import { getAllExpenses, getAllProjectRecords } from "@/actions/ceo/graphs.action";

interface UserExpense {
  id: string; // or number, depending on your user ID type
  name: string;
  email: string;
  expenses: any[]; // replace `any` with a more specific type if possible
  projectExpenses: number;
}

interface RecentExpensesProps {
  startupId: number;
}

export default function RecentExpensesTable({
  startupId,
}: RecentExpensesProps) {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const [expenses, users, projects] = await Promise.all([
        getAllExpenses(startupId),
        getAllUser(user.id),
        getAllProjectRecords(startupId),
      ]);

      const userMap = users.reduce<Record<string, UserExpense>>((acc, user) => {
        acc[user.id] = {
          id: user.id,  // Include the id here
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          expenses: [],
          projectExpenses: 0,
        };
        return acc;
      }, {});

      // Aggregate regular expenses
      expenses.forEach((expense: { userId: string | number; }) => {
        if (userMap[expense.userId]) {
          userMap[expense.userId].expenses.push(expense);
        }
      });

      // Aggregate project expenses
      projects.forEach((project: { userId: string | number; totalExpenses: any; }) => {
        if (userMap[project.userId]) {
          userMap[project.userId].projectExpenses += parseFloat(
            project.totalExpenses || "0"
          );
        }
      });

      const combinedData = Object.entries(userMap)
        .filter(
          ([_, userData]) =>
            userData.expenses.length > 0 || userData.projectExpenses > 0
        )
        .flatMap(([userId, userData]) => {
          const regularExpenses = userData.expenses.map((expense) => ({
            ...expense,
            userName: userData.name,
            userEmail: userData.email,
            type: "expense",
          }));

          const items = [...regularExpenses];

          if (userData.projectExpenses > 0) {
            items.push({
              id: `project-${userId}`,
              userId,
              userName: userData.name,
              userEmail: userData.email,
              amount: userData.projectExpenses,
              type: "project",
            });
          }

          return items;
        });

      setData(combinedData);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({
        title: "Error",
        description: "Failed to fetch items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Recent Expenses & Project Expenses</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>{item.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {item.userName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.userEmail}
                </p>
              </div>
              <div className="ml-auto font-medium">
                - ₱{formatNumber(item.amount.toFixed(2))}
              </div>
              <div className="ml-2 text-sm text-muted-foreground">
                {item.type === "project" ? "(Project Expenses)" : ""}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserData } from "@/actions/auth/user.action";
import { useToast } from "@/components/ui/use-toast";
import { getAllExpenses, getAllProjects } from "@/actions/ceo/dashboard.action";
import { formatNumber } from "@/lib/utils";

interface ExpenseOrProject {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  createdAt: string;
  type: 'expense' | 'project';
}

export default function ExpensesAndProjectsTable() {
  const { toast } = useToast();
  const [data, setData] = useState<ExpenseOrProject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const [expenses, projects] = await Promise.all([
        getAllExpenses(user.id),
        getAllProjects(user.id),
      ]);

      if (Array.isArray(expenses) && Array.isArray(projects)) {
        const combinedData = [...expenses, ...projects].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setData(combinedData);
      } else {
        console.error("Error fetching data:", { expenses, projects });
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
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
                - {formatNumber(item.amount)}
              </div>
              <div className="ml-2 text-sm text-primary">
                {item.type === "project" ? "(Project Expenses)" : ""}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
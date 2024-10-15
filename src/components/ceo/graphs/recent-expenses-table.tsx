import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { formatNumber } from "@/lib/utils";
import { getAllExpenses, getAllProjectRecords } from "@/actions/ceo/graphs.action";

interface Expense {
  id: string;
  amount: number;
  category: { categoryName: string };
  user: { id: string; firstName: string; lastName: string; email: string };
}

interface Project {
  id: string;
  totalExpenses: number;
  projectName: string;
  user: { id: string; firstName: string; lastName: string; email: string };
}

interface RecentExpensesProps {
  startupId: number;
}

export default function RecentExpensesTable({ startupId }: RecentExpensesProps) {
  const { toast } = useToast();
  const [data, setData] = useState<(Expense | Project)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [expenses, projects] = await Promise.all([
        getAllExpenses(startupId),
        getAllProjectRecords(startupId),
      ]);

      if (expenses.error || projects.error) {
        throw new Error(expenses.error || projects.error);
      }

      const formattedExpenses: Expense[] = expenses.map((expense: Expense) => ({
        ...expense,
        type: 'expense',
      }));

      const formattedProjects: Project[] = projects.map((project: Project) => ({
        ...project,
        type: 'project',
      }));

      const combinedData = [...formattedExpenses, ...formattedProjects].sort(
        (a, b) => {
          const aAmount = 'amount' in a ? a.amount : a.totalExpenses;
          const bAmount = 'amount' in b ? b.amount : b.totalExpenses;
          return bAmount - aAmount;
        }
      );

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
  }, [startupId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderItem = (item: Expense | Project) => {
    const isProject = 'projectName' in item;
    const userName = `${item.user.firstName} ${item.user.lastName}`;
    const amount = isProject ? item.totalExpenses : item.amount;
    const title = isProject ? item.projectName : item.category.categoryName;

    return (
      <div key={item.id} className="flex items-center gap-4">
        <Avatar className="h-9 w-9 sm:flex">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <p className="text-sm font-medium leading-none">
            {userName}
          </p>
          <p className="text-sm text-muted-foreground">
            {item.user.email}
          </p>
        </div>
        <div className="ml-auto font-medium">
          - {formatNumber(amount)}
        </div>
        <div className="ml-2 text-sm text-primary">
          {title} {isProject ? "(Project Expense)" : "(Personal Expense)"}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses & Project Expenses</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {loading ? (
          <div>Loading...</div>
        ) : data.length === 0 ? (
          <div>No expenses found.</div>
        ) : (
          data.map(renderItem)
        )}
      </CardContent>
    </Card>
  );
}

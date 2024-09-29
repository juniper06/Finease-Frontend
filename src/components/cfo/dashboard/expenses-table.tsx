"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity } from "lucide-react";
import { getAllExpenses } from "@/actions/cfo/expenses.action";
import { getAllCategory } from "@/actions/cfo/category.action";
import { getAllProjects } from "@/actions/cfo/project.action"; // Add this import
import { getUserData } from "@/actions/auth/user.action";
import { useToast } from "@/components/ui/use-toast";
import { formatNumber } from "@/lib/utils";

export default function ExpensesAndProjectsTable() {
  const { toast } = useToast();
  const [expensesData, setExpensesData] = useState<any[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]); // New state for projects
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const [expenses, categories, projects] = await Promise.all([
        getAllExpenses(user.id),
        getAllCategory(user.id),
        getAllProjects(user.id), // Fetch projects
      ]);
      const categoryMap = categories.reduce(
        (
          acc: { [x: string]: any },
          category: { id: string | number; categoryName: any }
        ) => {
          acc[category.id] = category.categoryName;
          return acc;
        },
        {}
      );
      const updatedExpenses = expenses.map(
        (expense: { categoryId: string | number }) => ({
          ...expense,
          categoryName: categoryMap[expense.categoryId] || "Unknown Category",
        })
      );
      setExpensesData(updatedExpenses);
      setProjectsData(projects); // Set projects data
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

  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Recent Expenses & Projects</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {expensesData.map((expense) => (
              <div
                key={`expense-${expense.id}`}
                className="flex items-center gap-4"
              >
                <Avatar className="h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>
                    {expense.categoryName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {expense.categoryName}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  - ₱{formatNumber(parseFloat(expense.amount))}
                </div>
              </div>
            ))}
            {projectsData.map((project) => (
              <div
                key={`project-${project.id}`}
                className="flex items-center gap-4"
              >
                <Avatar className="h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/02.png" alt="Avatar" />
                  <AvatarFallback>
                    {project.projectName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {project.projectName}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  - ₱
                  {formatNumber(parseFloat(project.totalExpenses))}
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}

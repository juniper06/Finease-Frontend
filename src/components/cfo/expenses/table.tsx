"use client";
import { getUserData } from "@/actions/auth/user.action";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/components/ui/use-toast";
import React, { useCallback, useEffect, useState } from "react";
import { Expenses, expensesColumns } from "./columns";
import { deleteExpenses, getAllExpenses } from "@/actions/cfo/expenses.action";
import { getAllCategory } from "@/actions/cfo/category.action";

export const ExpensesTable = () => {
  const [data, setData] = useState<Expenses[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [tableKey, setTableKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const [expenses, categories] = await Promise.all([
        getAllExpenses(user.id),
        getAllCategory(user.id),
      ]);
      const categoryMap = categories.reduce((acc, category) => {
        acc[category.id] = category.categoryName;
        return acc;
      }, {});
      const updatedExpenses = expenses.map((expense) => ({
        ...expense,
        categoryName: categoryMap[expense.categoryId],
      }));
      setData(updatedExpenses);
    } catch (error) {
      console.error("Failed to fetch expenses", error);
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

  const handleDelete = async (id: string) => {
    const result = await deleteExpenses(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Expenses deleted successfully.",
      });
      await fetchData();
      setTableKey((prevKey) => prevKey + 1);
    } else {
      console.error("Failed to delete expenses:", result.error);
      toast({
        title: "Error",
        description: result.error || "Failed to delete expenses. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <DataTable columns={expensesColumns} data={data} onDelete={handleDelete}/>;
};

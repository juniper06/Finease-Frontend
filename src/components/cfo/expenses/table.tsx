"use client"
import { getUserData } from "@/actions/auth/user.action";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/components/ui/use-toast";
import React, { useCallback, useEffect, useState } from "react";
import { expensesColumns } from "./columns";
import { deleteExpenses, Expenses, getAllExpenses } from "@/actions/cfo/expenses.action";
import { getAllCategory, Category } from "@/actions/cfo/category.action";

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

      // Create a map of category id to category name
      const categoryMap = categories.reduce((acc: { [key: string]: string }, category: Category) => {
        acc[category.id] = category.categoryName;
        return acc;
      }, {});

      // Map the expenses and add the category name if it exists in the Expenses type
      const updatedExpenses = expenses.map((expense: Expenses) => ({
        ...expense,
        categoryName: categoryMap[expense.category?.id] || expense.category?.categoryName || 'Unknown Category',
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

  return <DataTable columns={expensesColumns} data={data} onDelete={handleDelete} />;
};
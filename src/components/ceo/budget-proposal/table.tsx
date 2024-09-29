"use client";
import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { BudgetProposalColumns } from "./columns";
import { useToast } from "@/components/ui/use-toast";
import { getUserData } from "@/actions/auth/user.action";
import { getAllBudgetProposals } from "@/actions/ceo/budget-proposal.action";

export const BudgetProposalTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [tableKey, setTableKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const budgetProposals = await getAllBudgetProposals(user.id);

      if (budgetProposals.error) {
        throw new Error(budgetProposals.error);
      }

      setData(budgetProposals);
    } catch (error) {
      console.error("Failed to fetch budget proposals", error);
      toast({
        title: "Error",
        description: "Failed to fetch budget proposals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DataTable
      key={tableKey}
      columns={BudgetProposalColumns}
      data={data}
    />
  );
};

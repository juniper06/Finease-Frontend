"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  getAllBudgetProposals,
  deleteBudgetProposal,
  BudgetProposal,
} from "@/actions/cfo/budget-proposal.action";
import { DataTable } from "@/components/data-table";
import { BudgetProposalColumns } from "./columns";
import { useToast } from "@/components/ui/use-toast";
import { getUserData } from "@/actions/auth/user.action";

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

  const handleDelete = async (id: string) => {
    const result = await deleteBudgetProposal(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Budget proposal deleted successfully.",
      });
      await fetchData();
      setTableKey((prevKey) => prevKey + 1);
    } else {
      console.error("Failed to delete budget proposal:", result.error);
      toast({
        title: "Error",
        description:
          result.error || "Failed to delete budget proposal. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DataTable<BudgetProposal, BudgetProposal>
      key={tableKey}
      columns={BudgetProposalColumns}
      data={data}
      onApprove={function (id: number): Promise<void> {
        throw new Error("Function not implemented.");
      }}
      onReject={function (id: number): Promise<void> {
        throw new Error("Function not implemented.");
      }}
      onDelete={function (id: string): Promise<void> {
        throw new Error("Function not implemented.");
      }}
    />
  );
};

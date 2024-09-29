"use client";

import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/components/ui/use-toast";
import { getUserData } from "@/actions/auth/user.action";
import {
  BudgetProposal,
  getAllBudgetProposals,
} from "@/actions/ceo/budget-proposal.action";
import { BudgetProposalColumns } from "./columns";

export const BudgetProposalTable = () => {
  const [data, setData] = useState<BudgetProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [tableKey, setTableKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const budgetProposals = await getAllBudgetProposals(user.id);

      if (Array.isArray(budgetProposals)) {
        setData(budgetProposals);
      } else {
        throw new Error("Failed to fetch budget proposals");
      }
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
    <DataTable<BudgetProposal, BudgetProposal>
      key={tableKey}
      columns={BudgetProposalColumns}
      data={data} onApprove={function (id: number): Promise<void> {
        throw new Error("Function not implemented.");
      } } onReject={function (id: number): Promise<void> {
        throw new Error("Function not implemented.");
      } } onDelete={function (id: string): Promise<void> {
        throw new Error("Function not implemented.");
      } }    />
  );
};

import BudgetProposalForm from "@/components/cfo/budget-proposal/add-form";
import Layout from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default async function AddBudgetProposal() {
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          New Budget Proposal
        </h1>
      </div>
      <Separator/>
      <BudgetProposalForm/>
    </Layout>
  );
}

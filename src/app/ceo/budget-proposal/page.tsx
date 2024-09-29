import { BudgetProposalTable } from "@/components/ceo/budget-proposal/table";
import Layout from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function ItemsPage() {
  return (
    <>
      {" "}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          All Budget Proposals
        </h1>
      </div>
      <Separator />
      <BudgetProposalTable />
    </>
  );
}

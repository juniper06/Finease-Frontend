import { ViewBudgetProposal } from "@/components/cfo/budget-proposal/view-form";
import Layout from "@/components/Navbar";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function ViewProject({ params }: Props) {
  const { id } = params;
  return (
    <Layout>
      <ViewBudgetProposal id={id} />
    </Layout>
  );
}

import { ViewBudgetProposal } from "@/components/ceo/budget-proposal/view-form";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function ViewProject({ params }: Props) {
  const { id } = params;
  return (
    <>
      <ViewBudgetProposal id={id} />
    </>
  );
}

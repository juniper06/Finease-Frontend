import TotalExpenses from "@/components/ceo/dashboard/total-expenses";
import { ViewStartup } from "@/components/ceo/startup/view-form";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function ViewStartupPage({ params }: Props) {
  const { id } = params;
  return (
    <>
      <ViewStartup id={id} />
    </>
  );
}

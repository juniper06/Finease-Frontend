import Layout from "@/components/Navbar";
import { AddExpensesForm } from "@/components/cfo/expenses/add-form";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default async function AddItemPage() {
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          Record Expenses
        </h1>
      </div>
      <Separator/>
      <AddExpensesForm/>
    </Layout>
  );
}

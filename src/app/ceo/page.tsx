import React from "react";
import TotalSales from "@/components/ceo/dashboard/total-sales";
import TotalExpenses from "@/components/ceo/dashboard/total-expenses";
import TotalCustomer from "@/components/ceo/dashboard/total-customer";
import TotalItems from "@/components/ceo/dashboard/total-items";
import { TotalGraph } from "@/components/ceo/dashboard/graph";
import RecentSalesTable from "@/components/ceo/dashboard/sales-table";
import ExpensesTable from "@/components/ceo/dashboard/expenses-table";
import { FinancialForecasting } from "@/components/ceo/dashboard/financial-forecasting";

export default function CEOHome() {
  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      <main className="flex flex-col gap-4 p-4 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <TotalSales />
          <TotalExpenses />
          <TotalCustomer />
          <TotalItems />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <FinancialForecasting />
          <TotalGraph />
          <RecentSalesTable />
          <ExpensesTable />
        </div>
      </main>
    </>
  );
}

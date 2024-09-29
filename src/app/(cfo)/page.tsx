import Layout from "@/components/Navbar";
import TotalSales from "@/components/cfo/dashboard/total-sales";
import TotalCustomer from "@/components/cfo/dashboard/total-customer";
import TotalItems from "@/components/cfo/dashboard/total-items";
import TotalExpenses from "@/components/cfo/dashboard/total-expenses";
import RecentExpensesTable from "@/components/cfo/dashboard/expenses-table";
import RecentSalesTable from "@/components/cfo/dashboard/sales-table";
import { TotalGraph } from "@/components/cfo/dashboard/graph";

export default async function Home() {
  return (
    <Layout>
      <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      <main className="flex flex-col gap-4 p-4 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <TotalSales />
          <TotalExpenses />
          <TotalCustomer />
          <TotalItems />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <RecentSalesTable />
          <RecentExpensesTable />
        </div>
        <TotalGraph/>
      </main>
    </Layout>
  );
}

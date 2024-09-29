import Layout from "@/components/Navbar";
import { CustomerTable } from "@/components/cfo/customers/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CirclePlus } from "lucide-react";
import Link from "next/link";


export default async function CustomerPage() {
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">All Customers</h1>
        <Button className="flex gap-2 text-md" asChild><Link href="/customers/add-customer"><CirclePlus className="h-6 w-6"/>New</Link></Button>
      </div>
      <Separator/>
      <CustomerTable/>
    </Layout>
  );
}

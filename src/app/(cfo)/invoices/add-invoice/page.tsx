import Layout from "@/components/Navbar";
import { AddInvoiceForm } from "@/components/cfo/invoices/add-form";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default async function InvoiceForm() {
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          New Invoice
        </h1>
      </div>
      <Separator/>
      <AddInvoiceForm/>
    </Layout>
  );
}

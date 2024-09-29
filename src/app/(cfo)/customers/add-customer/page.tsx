import Layout from "@/components/Navbar";
import CustomerForm from "@/components/cfo/customers/add-form";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default async function AddCustomerPage() {
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          New Customer
        </h1>
      </div>
      <Separator/>
      <CustomerForm/>
    </Layout>
  );
}

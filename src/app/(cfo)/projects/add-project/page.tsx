import { AddProjectForm } from "@/components/cfo/projects/add-form";
import Layout from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default async function AddItemPage() {
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          New Project
        </h1>
      </div>
      <Separator/>
      <AddProjectForm/>
    </Layout>
  );
}

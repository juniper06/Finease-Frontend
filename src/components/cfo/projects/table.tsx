"use client";
import {
  deleteProject,
  getAllProjects,
  Project,
} from "@/actions/cfo/project.action";
import { DataTable } from "@/components/data-table";
import React, { useCallback, useEffect, useState } from "react";
import { ProjectsColumns } from "./columns";
import { getUserData } from "@/actions/auth/user.action";
import { useToast } from "@/components/ui/use-toast";
import { getAllCustomers, Customer } from "@/actions/cfo/customer.action";

export const ProjectsTable = () => {
  const [data, setData] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [tableKey, setTableKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const projects = await getAllProjects(user.id);
      const customers = await getAllCustomers(user.id);

      const customerMap = customers.reduce((acc: { [key: string]: string }, customer: Customer) => {
        acc[customer.id] = `${customer.firstName} ${customer.lastName}`;
        return acc;
      }, {});

      const updatedProjects = projects.map((project) => ({
        ...project,
        customerName: customerMap[project.customerId],
      }));

      setData(updatedProjects);
      setCustomers(customerMap);
    } catch (error) {
      console.error("Failed to fetch projects", error);
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    const result = await deleteProject(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
      await fetchData();
      setTableKey((prevKey) => prevKey + 1);
    } else {
      console.error("Failed to delete project:", result.error);
      toast({
        title: "Error",
        description: result.error || "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DataTable columns={ProjectsColumns} data={data} onDelete={handleDelete} />
  );
};

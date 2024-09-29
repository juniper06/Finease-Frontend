"use client";
import { Customer, deleteCustomer, getAllCustomers } from "@/actions/cfo/customer.action";
import { getUserData } from "@/actions/auth/user.action";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/components/ui/use-toast";
import React, { useCallback, useEffect, useState } from "react";
import {  customerColumns } from "./columns";

export const CustomerTable = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [tableKey, setTableKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const customers = await getAllCustomers(user.id);
      setData(customers);
    } catch (error) {
      console.error("Failed to fetch customers", error);
      toast({
        title: "Error",
        description: "Failed to fetch items. Please try again.",
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
    const result = await deleteCustomer(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Customer deleted successfully.",
      });
      await fetchData();
      setTableKey((prevKey) => prevKey + 1);
    } else {
      console.error("Failed to delete customer:", result.error);
      toast({
        title: "Error",
        description: result.error || "Failed to delete customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <DataTable key={tableKey} columns={customerColumns} data={data} onDelete={handleDelete} />;
};

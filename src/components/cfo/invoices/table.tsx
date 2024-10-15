'use client'
import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/components/ui/use-toast";
import { invoicesColumns } from "./columns";
import { deleteInvoice, getAllInvoices, Invoice } from "@/actions/cfo/invoice.action";
import { getUserData } from "@/actions/auth/user.action";

export const InvoiceTable = () => {
  const [data, setData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [tableKey, setTableKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const invoices = await getAllInvoices(user.id);

      if (Array.isArray(invoices)) {
        setData(invoices);
      } else {
        console.error("Unexpected invoices data:", invoices);
        toast({
          title: "Error",
          description: "Failed to fetch invoices. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch invoices", error);
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
    const result = await deleteInvoice(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Invoice deleted successfully.",
      });
      await fetchData();
      setTableKey((prevKey) => prevKey + 1);
    } else {
      console.error("Failed to delete Invoice:", result.error);
      toast({
        title: "Error",
        description: result.error || "Failed to delete Invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <DataTable columns={invoicesColumns} data={data} onDelete={handleDelete} />;
};
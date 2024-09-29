"use client";
import { getAllCustomers } from "@/actions/cfo/customer.action";
import { getUserData } from "@/actions/auth/user.action";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/components/ui/use-toast";
import React, { useCallback, useEffect, useState } from "react";
import { Payment, deletePaymentRecord, getAllPaymentRecords } from "@/actions/cfo/payment.action";
import { ReceivedPaymentsColumns } from "./columns";

export const PaymentsTable = () => {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [tableKey, setTableKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const payments = await getAllPaymentRecords(user.id);
      const customers = await getAllCustomers(user.id);

      const customerMap = customers.reduce((acc, customer) => {
        acc[customer.id] = `${customer.firstName} ${customer.lastName}`;
        return acc;
      }, {});

      const updatedPayments = payments.map((payment) => ({
        ...payment,
        customerName: customerMap[payment.customerId],
        invoiceNumber: payment.invoices?.invoiceNumber,
      }));

      setData(updatedPayments);
    } catch (error) {
      console.error("Failed to fetch payment records", error);
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
    const result = await deletePaymentRecord(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Payment record deleted successfully.",
      });
      await fetchData();
      setTableKey((prevKey) => prevKey + 1);
    } else {
      console.error("Failed to delete payment record:", result.error);
      toast({
        title: "Error",
        description: result.error || "Failed to delete payment record. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <DataTable columns={ReceivedPaymentsColumns} data={data} onDelete={handleDelete}/>;
};

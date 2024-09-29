"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserData } from "@/actions/auth/user.action";
import { getAllPaymentRecords } from "@/actions/cfo/payment.action";
import { getAllCustomers } from "@/actions/cfo/customer.action";
import { useToast } from "@/components/ui/use-toast";
import { formatNumber } from "@/lib/utils";

export default function RecentSalesTable() {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const user = await getUserData();
        const payments = await getAllPaymentRecords(user.id);
        const customers = await getAllCustomers(user.id);

        const customerMap = customers.reduce((acc: { [x: string]: { name: string; email: any; }; }, customer: { id: string | number; firstName: any; lastName: any; email: any; }) => {
          acc[customer.id] = {
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
          };
          return acc;
        }, {});

        const updatedPayments = payments.map((payment: { customerId: string | number; }) => ({
          ...payment,
          customerName:
            customerMap[payment.customerId]?.name || "Unknown Customer",
          customerEmail: customerMap[payment.customerId]?.email || "N/A",
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
    }

    fetchData();
  }, [toast]);

  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          data.map((payment) => (
            <div key={payment.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9 sm:flex">
                <AvatarFallback>
                  {payment.customerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {payment.customerName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {payment.customerEmail}
                </p>
              </div>
              <div className="ml-auto font-medium">
                + ₱{formatNumber(payment.totalAmount.toFixed(2))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

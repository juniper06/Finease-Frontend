"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserData } from "@/actions/auth/user.action";
import { getAllPaymentRecords } from "@/actions/cfo/payment.action";
import { useToast } from "@/components/ui/use-toast";
import { formatNumber } from "@/lib/utils";

export default function RecentSalesTable() {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getUserData();
        const payments = await getAllPaymentRecords(user.id);

        if (Array.isArray(payments)) {
          setData(payments);
        } else {
          console.error("Unexpected payments data:", payments);
          toast({
            title: "Error",
            description: "Failed to fetch payments. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to fetch payment records", error);
        toast({
          title: "Error",
          description: "Failed to fetch payments. Please try again.",
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
                  {payment.customerName ? payment.customerName.charAt(0) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {payment.customerName || "Unknown Customer"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {payment.customer?.email || "N/A"}
                </p>
              </div>
              <div className="ml-auto font-medium">
                + {formatNumber(payment.totalAmount.toFixed(2))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
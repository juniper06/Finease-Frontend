"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatNumber } from "@/lib/utils";
import { getAllPaymentRecords } from "@/actions/ceo/graphs.action";

interface RecentSalesProps {
  startupId: number;
}

export default function RecentSalesTable({ startupId }: RecentSalesProps) {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const payments = await getAllPaymentRecords(startupId);

        setData(payments);
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
  }, [toast, startupId]);

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
                <AvatarFallback>{payment.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {payment.userName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {payment.userEmail}
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

"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserData } from "@/actions/auth/user.action";
import { useToast } from "@/components/ui/use-toast";
import { getAllPaymentRecords } from "@/actions/ceo/dashboard.action";
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

        // Check if payments is an array before setting the data
        if (Array.isArray(payments)) {
          setData(payments);
        } else {
          console.error("Payments data is not an array:", payments);
          setData([]);
        }
      } catch (error) {
        console.error("Failed to fetch payment records", error);
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
                  {payment.userName ? payment.userName.charAt(0) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {payment.userName || "Unknown User"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {payment.userEmail || "N/A"}
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
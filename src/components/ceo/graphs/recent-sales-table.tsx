"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserData, getAllUser } from "@/actions/auth/user.action";
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
        const user = await getUserData();
        const payments = await getAllPaymentRecords(startupId);
        const users = await getAllUser(user.id);

        const userMap = users.reduce((acc, user) => {
          acc[user.id] = {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          };
          return acc;
        }, {});

        const updatedPayments = payments.map((payment) => ({
          ...payment,
          userName: userMap[payment.userId]?.name || "Unknown User",
          userEmail: userMap[payment.userId]?.email || "N/A",
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
                + ₱{formatNumber(payment.totalAmount.toFixed(2))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

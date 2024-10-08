"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserData, getAllUser } from "@/actions/auth/user.action";
import { useToast } from "@/components/ui/use-toast";
import { getAllPaymentRecords } from "@/actions/ceo/dashboard.action";
import { formatNumber } from "@/lib/utils";

// Define the interface for the user map
interface UserMap {
  [key: string]: {
    name: string;
    email: string;
  };
}

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
        const users = await getAllUser(user.id);

        const userMap: UserMap = users.reduce((acc: UserMap, user) => {
          acc[user.id] = {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          };
          return acc;
        }, {});

        // Check if payments is an array before mapping
        const updatedPayments = Array.isArray(payments) 
          ? payments.map((payment) => ({
              ...payment,
              userName: userMap[payment.userId]?.name || "Unknown User",
              userEmail: userMap[payment.userId]?.email || "N/A",
            }))
          : []; // Default to empty array if not an array

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
                  {payment.userName.charAt(0)}
                </AvatarFallback>
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

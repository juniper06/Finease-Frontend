"use client";
import { DataTable } from "@/components/data-table";
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { startupsColumns } from "./columns";
import { getAllStartups } from "@/actions/guest/guest.action";
import { Startup } from "@/actions/ceo/startup.action";

export const GuestStartupTable = () => {
  const [data, setData] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [tableKey, setTableKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all startups without passing userId
      const startups = await getAllStartups();
      console.log("Fetched Startups:", startups); // Debugging
      setData(startups);
    } catch (error) {
      console.error("Failed to fetch startups", error);
      toast({
        title: "Error",
        description: "Failed to fetch startups. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DataTable<Startup, Startup>
      key={tableKey}
      columns={startupsColumns}
      data={data}
      onDelete={function (id: string): Promise<void> {
        throw new Error("Function not implemented.");
      }}
    />
  );
};

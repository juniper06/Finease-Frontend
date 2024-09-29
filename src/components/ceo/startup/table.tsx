"use client";
import { DataTable } from "@/components/data-table";
import React, { useState, useEffect, useCallback } from "react";
import { getUserData } from "@/actions/auth/user.action";
import { useToast } from "@/components/ui/use-toast";
import { deleteStartup, getAllStartups, Startup } from "@/actions/ceo/startup.action";
import { startupsColumns } from "./columns";

export const StartupTable = () => {
  const [data, setData] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [tableKey, setTableKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const userId = Number(user.id);
      console.log("User ID:", userId); // Debugging
      const startups = await getAllStartups(userId);
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

  const handleDelete = async (id: string) => {
    const result = await deleteStartup(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Startup deleted successfully.",
      });
      await fetchData();
      setTableKey((prevKey) => prevKey + 1);
    } else {
      console.error("Failed to delete startup:", result.error);
      toast({
        title: "Error",
        description: result.error || "Failed to delete startup. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DataTable columns={startupsColumns} data={data} onDelete={handleDelete} />
  );
};

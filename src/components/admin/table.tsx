"use client"; 

import { User, deleteUser, getAllUser, getUserData } from "@/actions/auth/user.action";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/components/ui/use-toast";
import React, { useCallback, useEffect, useState } from "react";
import { usersColumn } from "./columns";

export const UsersTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [tableKey, setTableKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await getUserData();
      const users = await getAllUser(userData.id);
      setData(users || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
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
    const result = await deleteUser(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      await fetchData();
      setTableKey((prevKey) => prevKey + 1);
    } else {
      console.error("Failed to delete User:", result.error);
      toast({
        title: "Error",
        description: result.error || "Failed to delete User. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No users found.</div>;
  }

  return <DataTable columns={usersColumn} data={data} onDelete={handleDelete} onApprove={function (id: number): Promise<void> {
    throw new Error("Function not implemented.");
  } } onReject={function (id: number): Promise<void> {
    throw new Error("Function not implemented.");
  } }/>;
};

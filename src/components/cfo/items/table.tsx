"use client";
import { Items, itemsColumns } from "@/components/cfo/items/columns";
import { DataTable } from "@/components/data-table";
import React, { useState, useEffect, useCallback } from "react";
import { deleteItem, getAllitems } from "@/actions/cfo/item.action";
import { getUserData } from "@/actions/auth/user.action";
import { useToast } from "@/components/ui/use-toast";

export const ItemTable = () => {
  const [data, setData] = useState<Items[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [tableKey, setTableKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const items = await getAllitems(user.id);
      setData(items);
    } catch (error) {
      console.error("Failed to fetch items", error);
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
    const result = await deleteItem(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Item deleted successfully.",
      });
      await fetchData();
      setTableKey((prevKey) => prevKey + 1);
    } else {
      console.error("Failed to delete item:", result.error);
      toast({
        title: "Error",
        description: result.error || "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DataTable columns={itemsColumns} data={data} onDelete={handleDelete} />
  );
};

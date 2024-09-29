"use client"
import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/components/ui/use-toast";
import { approveUser, getPendingCEOs, rejectUser } from "@/actions/admin/admin.action";
import { CEOColumns, CEORequest } from "./ceo-columns";

export const CEOTable = () => {
  const [data, setData] = useState<CEORequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const pendingRequests = await getPendingCEOs();
      setData(pendingRequests || []);
    } catch (error) {
      console.error("Failed to fetch CEO requests", error);
      toast({
        title: "Error",
        description: "Failed to fetch CEO requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (id: number) => {
    const result = await approveUser(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "CEO request approved successfully.",
      });
      await fetchData();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to approve CEO request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: number) => {
    const result = await rejectUser(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "CEO request rejected successfully.",
      });
      await fetchData();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to reject CEO request. Please try again.",
        variant: "destructive",
      });
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No pending CEO requests found.</div>;
  }

  function handleDelete(id: string): Promise<void> {
    throw new Error("Function not implemented.");
  }

  return (
    <DataTable<CEORequest, unknown>
      columns={CEOColumns}
      data={data}
      onApprove={handleApprove}
      onReject={handleReject}
      onDelete={handleDelete}
    />
  );
};

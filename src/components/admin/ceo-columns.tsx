import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export type CEORequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  startupCode: string;
};

const ActionCell = ({ request, onApprove, onReject, onDelete }: { request: CEORequest; onApprove: (id: string) => Promise<void>; onReject: (id: string) => Promise<void>; onDelete: (id: string) => Promise<void>; }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(request.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={() => onApprove(request.id)} className="mr-2">
          Accept
        </Button>
        <Button onClick={() => onReject(request.id)} variant="destructive">
          Reject
        </Button>
        <Button onClick={() => setIsDeleteDialogOpen(true)} variant="outline">
          Delete
        </Button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the CEO request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const CEOColumns: ColumnDef<CEORequest>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const request = row.original;
      const { onApprove, onReject, onDelete } = table.options.meta as {
        onApprove: (id: string) => Promise<void>;
        onReject: (id: string) => Promise<void>;
        onDelete: (id: string) => Promise<void>;
      };

      return (
        <ActionCell
          request={request}
          onApprove={onApprove}
          onReject={onReject}
          onDelete={onDelete}
        />
      );
    },
  },
];

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import React from "react";

export type CEORequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  startupCode: string;
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
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const request = row.original;
      const { onApprove, onReject } = table.options.meta as {
        onApprove: (id: string) => Promise<void>;
        onReject: (id: string) => Promise<void>;
      };

      return (
        <div className="flex gap-2">
          <Button onClick={() => onApprove(request.id)} className="mr-2">
            Accept
          </Button>
          <Button onClick={() => onReject(request.id)} variant="destructive">
            Reject
          </Button>
        </div>
      );
    },
  },
];

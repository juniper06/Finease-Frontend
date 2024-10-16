"use client"
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatNumber } from "@/lib/utils";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Payment } from "@/actions/cfo/payment.action";

// Separate the ActionCell into its own component
const ActionCell = ({ paymentRecord, onDelete }: { paymentRecord: Payment; onDelete: (id: string) => Promise<void>; }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(paymentRecord.id);
    setIsAlertOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            {/* <Link href={`/payments-received/edit-payments-received/${paymentRecord.id}`}>
              Edit
            </Link> */}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAlertOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item.
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

export const ReceivedPaymentsColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "dateOfPayment",
    header: "Date",
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    accessorKey: "paymentNumber",
    header: "Payment #",
  },
  {
    accessorKey: "referenceNumber",
    header: "Reference number",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "modeOfPayment",
    header: "Mode of Payment",
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => formatNumber(row.original.totalAmount),
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const paymentRecord = row.original;
      const { onDelete } = table.options.meta as {
        onDelete: (id: string) => Promise<void>;
      };

      return <ActionCell paymentRecord={paymentRecord} onDelete={onDelete} />;
    },
  },
];

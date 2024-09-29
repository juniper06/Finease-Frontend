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
import { Invoice } from "@/actions/cfo/invoice.action";

// Separate the ActionCell into its own component
const ActionCell = ({ invoice, onDelete }: { invoice: Invoice; onDelete: (id: string) => Promise<void>; }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(invoice.id);
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
            <Link href={`/invoices/edit-invoice/${invoice.id}`}>
              Edit
            </Link>
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

export const invoicesColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ getValue }) => formatDate(getValue() as string),
    meta: { hiddenOnMobile: true },
  },
  {
    accessorKey: "invoiceNumber",
    header: "Invoice No.",
    meta: { hiddenOnMobile: true },
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    accessorKey: "total",
    header: "Total Amount",
    cell: ({ row }) => formatNumber(row.original.total),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let color = "text-gray-500";
      if (status === "paid") color = "text-green-500";
      if (status === "partially paid") color = "text-yellow-500";
      if (status === "overdue") color = "text-red-500";
      return <span className={color}>{status}</span>;
    },
  },
  {
    accessorKey: "balanceDue",
    header: "Balance Due",
    cell: ({ row }) => formatNumber(row.original.balanceDue),
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const invoice = row.original;
      const { onDelete } = table.options.meta as {
        onDelete: (id: string) => Promise<void>;
      };

      return <ActionCell invoice={invoice} onDelete={onDelete} />;
    },
  },
];

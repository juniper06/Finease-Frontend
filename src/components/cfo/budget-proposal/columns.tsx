"use client"
import { ColumnDef } from "@tanstack/react-table";
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
import { BudgetProposal } from "@/actions/cfo/budget-proposal.action";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

// Separate the ActionCell into its own component
const ActionCell = ({ budgetProposal, onDelete }: { budgetProposal: BudgetProposal; onDelete: (id: string) => Promise<void>; }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(budgetProposal.id);
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
              This action cannot be undone. This will permanently delete the budget proposal.
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

export const BudgetProposalColumns: ColumnDef<BudgetProposal>[] = [
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <Link href={`/budget-proposal/view-budget-proposal/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {formatDate(row.getValue("createdAt") as string)}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "proposalTitle",
    header: "Proposal Title",
    cell: ({ row }) => (
      <Link href={`/budget-proposal/view-budget-proposal/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("proposalTitle")}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "proposalNumber",
    header: "Proposal  #",
    cell: ({ row }) => (
      <Link href={`/budget-proposal/view-budget-proposal/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("proposalNumber")}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "totalBudget",
    header: "Total Budget",
    cell: ({ row }) => (
      <Link href={`/budget-proposal/view-budget-proposal/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {formatNumber(row.original.totalBudget)}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "budgetPeriod",
    header: "Budget Period",
    cell: ({ row }) => (
      <Link href={`/budget-proposal/view-budget-proposal/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("budgetPeriod")}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => (
      <Link href={`/budget-proposal/view-budget-proposal/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {formatDate(row.getValue("startDate") as string)}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => (
      <Link href={`/budget-proposal/view-budget-proposal/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {formatDate(row.getValue("endDate") as string)}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColor =
        status === "APPROVED" ? "text-green-500" :
        status === "REJECTED" ? "text-red-500" : "";

      return (
        <Link href={`/budget-proposal/view-budget-proposal/${row.original.id}`}>
          <div className={`w-full h-full cursor-pointer ${statusColor}`}>
            {status}
          </div>
        </Link>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const budgetProposal = row.original;
      const { onDelete } = table.options.meta as {
        onDelete: (id: string) => Promise<void>;
      };

      return <ActionCell budgetProposal={budgetProposal} onDelete={onDelete} />;
    },
  },
];

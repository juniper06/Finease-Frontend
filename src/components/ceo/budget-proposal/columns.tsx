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
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { BudgetProposal } from "@/actions/ceo/budget-proposal.action";

export const BudgetProposalColumns: ColumnDef<BudgetProposal>[] = [
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <Link href={`/ceo/budget-proposal/view-budget-proposal/${row.original.id}`}>
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
      <Link href={`/ceo/budget-proposal/view-budget-proposal/${row.original.id}`}>
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
      <Link href={`/ceo/budget-proposal/view-budget-proposal/${row.original.id}`}>
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
      <Link href={`/ceo/budget-proposal/view-budget-proposal/${row.original.id}`}>
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
      <Link href={`/ceo/budget-proposal/view-budget-proposal/${row.original.id}`}>
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
      <Link href={`/ceo/budget-proposal/view-budget-proposal/${row.original.id}`}>
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
      <Link href={`/ceo/budget-proposal/view-budget-proposal/${row.original.id}`}>
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
      const statusColor = status === "APPROVED" ? "text-green-500" : status === "REJECTED" ? "text-red-500" : "";

      return (
        <Link href={`/ceo/budget-proposal/view-budget-proposal/${row.original.id}`}>
          <div className={`w-full h-full cursor-pointer ${statusColor}`}>
            {status}
          </div>
        </Link>
      );
    },
  },
];

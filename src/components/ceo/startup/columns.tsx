"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";
import Link from "next/link";
import { Startup } from "@/actions/ceo/startup.action";

// Separate the ActionCell into its own component
const ActionCell = ({ startup, onDelete }: { startup: Startup; onDelete: (id: number) => Promise<void>; }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(startup.id);
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
            <Link href={`/ceo/startups/edit/${startup.id}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAlertOpen(true)}>Delete</DropdownMenuItem>
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

export const startupsColumns: ColumnDef<Startup>[] = [
  {
    accessorKey: "companyName",
    header: "Company Name",
    cell: ({ row }) => (
      <Link href={`/ceo/startups/view-startup/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("companyName")}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => (
      <Link href={`/ceo/startups/view-startup/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("industry")}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => (
      <Link href={`/ceo/startups/view-startup/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("phoneNumber")}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "contactEmail",
    header: "Contact Email",
    cell: ({ row }) => (
      <Link href={`/ceo/startups/view-startup/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("contactEmail")}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "startupCode",
    header: "Startup Code",
    cell: ({ row }) => (
      <Link href={`/ceo/startups/view-startup/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("startupCode")}
        </div>
      </Link>
    ),
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const startup = row.original;
      const { onDelete } = table.options.meta as {
        onDelete: (id: number) => Promise<void>;
      };

      return <ActionCell startup={startup} onDelete={onDelete} />;
    },
  },
];

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
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { User } from "@/actions/auth/user.action";
import { editUser, deleteUser } from "@/actions/auth/user.action";
import { MoreHorizontal } from "lucide-react";

export const usersColumn: ColumnDef<User>[] = [
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      const [currentUser, setCurrentUser] = useState<User>(user); // State to hold the current user data

      const handleRoleChange = async (newRole: string) => {
        if (newRole === currentUser.role) return;

        const result = await editUser(user.id, { role: newRole });
        if (result.success) {
          // Update local state with the new role
          setCurrentUser({
            ...currentUser,
            role: newRole,
          });
          // Handle success (e.g., show toast message)
        } else {
          console.error("Failed to update role:", result.error);
          // Handle error (e.g., show toast message)
        }
      };

      const roleOptions = ["CEO", "GUEST"];

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              {currentUser.role}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {roleOptions.map((role) => (
              <DropdownMenuItem key={role} onClick={() => handleRoleChange(role)}>
                {role}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const user = row.original;
      const [isAlertOpen, setIsAlertOpen] = useState(false);
      const { onDelete } = table.options.meta as {
        onDelete: (id: string) => Promise<void>;
      };
      const handleDelete = async () => {
        await onDelete(user.id);
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
                  This action cannot be undone. This will permanently delete the
                  item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Customer, getCustomer } from "@/actions/cfo/customer.action";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Extract the view customer dialog into a separate component
const ViewCustomerDialog = ({ customerId, open, onOpenChange }: { customerId: string, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);
  const { toast } = useToast();

  const fetchCustomerDetails = async (id: string) => {
    try {
      const response = await getCustomer(id);
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      } else {
        setCustomerDetails(response);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch customer details. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch customer details when the dialog opens
  useState(() => {
    if (open) {
      fetchCustomerDetails(customerId);
    }
  }, [open, customerId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-none">
        <DialogDescription>
          {customerDetails && (
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Customer Details
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Business Information</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Business Type</span>
                      <span>{customerDetails.type}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Business Name</span>
                      <span>{customerDetails.companyName}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Customer Information</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">First Name</span>
                      <span>{customerDetails.firstName}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Name</span>
                      <span>{customerDetails.lastName}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{customerDetails.email}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Phone Number</span>
                      <span>{customerDetails.phoneNumber}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Customer Address</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Address</dt>
                      <dd>{customerDetails.country}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">City</dt>
                      <dd>{customerDetails.city}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">State</dt>
                      <dd>{customerDetails.state}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Zip Code</dt>
                      <dd>{customerDetails.zipCode}</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

// Extract the action cell logic into a separate component
const ActionCell = ({ customer, onDelete }: { customer: Customer, onDelete: (id: string) => Promise<void> }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(customer.id);
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
            <Link href={`/customers/edit-customer/${customer.id}`}>
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
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
    meta: { hiddenOnMobile: true },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { hiddenOnMobile: true },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    meta: { hiddenOnMobile: true },
  },
  {
    id: "view",
    header: "View",
    cell: ({ row }) => {
      const customer = row.original;
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      return (
        <>
          <Button className="w-11 h-8" onClick={() => setIsDialogOpen(true)}>
            View
          </Button>
          <ViewCustomerDialog customerId={customer.id} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const customer = row.original;
      const { onDelete } = table.options.meta as {
        onDelete: (id: string) => Promise<void>;
      };

      return <ActionCell customer={customer} onDelete={onDelete} />;
    },
  },
];

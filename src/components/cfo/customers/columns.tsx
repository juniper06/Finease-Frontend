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
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import Link from "next/link";
import { Customer, getCustomer } from "@/actions/cfo/customer.action";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Separate the ActionCell into its own component
const ActionCell = ({ customer, onDelete }: { customer: Customer; onDelete: (id: string) => Promise<void>; }) => {
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
            <Link href={`/customers/edit-customer/${customer.id}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAlertOpen(true)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer.
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

// Separate the ViewCustomerDetails component into its own function
const ViewCustomerDetails = ({ customerId }: { customerId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);
  const { toast } = useToast();

  const fetchCustomerDetails = async () => {
    try {
      const response = await getCustomer(customerId);
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      } else {
        setCustomerDetails(response);
        setIsDialogOpen(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customer details. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button className="w-11 h-8" onClick={fetchCustomerDetails}>View</Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-transparent border-none">
          <DialogDescription>
            {customerDetails && (
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="font-semibold">Business Information</div>
                  <ul className="mb-4">
                    <li>Business Type: {customerDetails.type}</li>
                    <li>Business Name: {customerDetails.companyName}</li>
                  </ul>
                  <Separator />
                  <div className="font-semibold">Customer Information</div>
                  <ul className="mb-4">
                    <li>First Name: {customerDetails.firstName}</li>
                    <li>Last Name: {customerDetails.lastName}</li>
                    <li>Email: {customerDetails.email}</li>
                    <li>Phone Number: {customerDetails.phoneNumber}</li>
                  </ul>
                  <Separator />
                  <div className="font-semibold">Customer Address</div>
                  <ul>
                    <li>Address: {customerDetails.country}</li>
                    <li>City: {customerDetails.city}</li>
                    <li>State: {customerDetails.state}</li>
                    <li>Zip Code: {customerDetails.zipCode}</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
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
    cell: ({ row }) => <ViewCustomerDetails customerId={row.original.id} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const customer = row.original;
      const { onDelete } = table.options.meta as { onDelete: (id: string) => Promise<void>; };
      return <ActionCell customer={customer} onDelete={onDelete} />;
    },
  },
];

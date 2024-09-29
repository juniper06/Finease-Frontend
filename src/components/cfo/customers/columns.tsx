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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Customer, getCustomer } from "@/actions/cfo/customer.action";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      const [customerDetails, setCustomerDetails] = useState<Customer | null>(
        null
      );
      const { toast } = useToast();

      const fetchCustomerDetails = async (customerId: string) => {
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
          <Button className="w-11 h-8" onClick={() => fetchCustomerDetails(customer.id)}>
            View
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-transparent border-none">
              <DialogDescription>
                {customerDetails && (
                  <Card
                    className="overflow-hidden"
                    x-chunk="dashboard-05-chunk-4"
                  >
                    <CardHeader className="flex flex-row items-start bg-muted/50">
                      <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                          Customer Details
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 text-sm">
                      <div className="grid gap-3">
                        <div className="font-semibold">
                          Business Information
                        </div>
                        <ul className="grid gap-3">
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Business Type
                            </span>
                            <span>{customerDetails.type}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Business Name
                            </span>
                            <span>{customerDetails.companyName}</span>
                          </li>
                        </ul>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid gap-3">
                        <div className="font-semibold">
                          Customer Information
                        </div>
                        <ul className="grid gap-3">
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              First Name
                            </span>
                            <span>{customerDetails.firstName}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Last Name
                            </span>
                            <span>{customerDetails.lastName}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Email</span>
                            <span>{customerDetails.email}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Phone Number
                            </span>
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
                            <dd>
                              <a href="mailto:">{customerDetails.city}</a>
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">State</dt>
                            <dd>
                              <a href="tel:">{customerDetails.state}</a>
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Zip Code</dt>
                            <dd>
                              <a href="tel:">{customerDetails.zipCode}</a>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const customer = row.original;
      const [isAlertOpen, setIsAlertOpen] = useState(false);
      const { onDelete } = table.options.meta as {
        onDelete: (id: string) => Promise<void>;
      };
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

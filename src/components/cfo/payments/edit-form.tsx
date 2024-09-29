"use client";
import React, { useEffect, useState, useCallback } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Customer, getAllCustomers } from "@/actions/cfo/customer.action";
import { User, getUserData } from "@/actions/auth/user.action";
import { Invoice, getInvoicesByCustomerId } from "@/actions/cfo/invoice.action";
import { editPaymentRecord, getPaymentRecord } from "@/actions/cfo/payment.action";

const formSchema = z.object({
  customerId: z.string({
    message: "Customer is Required",
  }),
  dateOfPayment: z.string().datetime({
    message: "Payment Date is Required",
  }),
  modeOfPayment: z.string({
    message: "Mode of Payment is Required",
  }),
  referenceNumber: z.string({
    message: "Reference Number is Required",
  }),
  paymentNumber: z.string({
    message: "Payment Number is Required",
  }),
  payments: z.array(
    z.object({
      invoiceId: z.number(),
      amount: z.number(),
    })
  ),
});

export const EditPaymentRecordForm = ({ paymentId }: { paymentId: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [payment, setPayment] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: "",
      dateOfPayment: "",
      modeOfPayment: "",
      referenceNumber: "",
      paymentNumber: "",
      payments: [],
    },
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const userData = await getUserData();
      if ("error" in userData) {
        toast({
          description: userData.error,
        });
      } else {
        setUser(userData);

        const [fetchedCustomers] = await Promise.all([
          getAllCustomers(userData.id),
        ]);

        if ("error" in fetchedCustomers) {
          toast({
            description: fetchedCustomers.error,
          });
        } else {
          setCustomers(fetchedCustomers);
        }

        if (paymentId) {
          const fetchedPayment = await getPaymentRecord(paymentId);
          if ("error" in fetchedPayment) {
            toast({
              description: fetchedPayment.error,
            });
          } else {
            setPayment(fetchedPayment);
            form.reset({
              ...fetchedPayment,
              customerId: fetchedPayment.customerId.toString()
            });
            const fetchedInvoices = await getInvoicesByCustomerId(fetchedPayment.customerId);
            setInvoices(fetchedInvoices);
          }
        } else {
          console.error("Payment ID is not provided");
        }
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({
        description: "Failed to fetch data.",
      });
    } finally {
      setLoading(false);
    }
  }, [paymentId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const currentPayments = form.getValues("payments");
    const newTotal = currentPayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );
    setTotal(newTotal);
  }, [form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        description: "You need to be logged in to edit a payment.",
      });
      return;
    }

    const totalAmount = values.payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );

    const paymentData = {
      ...values,
      userId: user.id,
      customerId: parseInt(values.customerId),
      dateOfPayment: new Date(values.dateOfPayment).toISOString(),
      totalAmount,
    };

    const response = await editPaymentRecord(paymentId, paymentData);
    if (response.error) {
      toast({
        description: "Failed to edit payment.",
      });
    } else {
      toast({
        description: "Payment edited successfully!",
      });
      form.reset();
      setIsDialogOpen(false);
      router.push("/payments-received");
    }
  };

  const handleCancel = () => {
    form.reset();
    toast({
      description: "Changes have been discarded.",
    });
    router.push("/payments-received");
  };

  return (
    <Form {...form}>
      <form
        className="w-auto flex flex-col gap-5 pb-[150px]"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light">
                Customer Name
              </FormLabel>
              <FormControl className="md:w-[400px]">
                <Input
                  value={
                    customers.find((c) => c.id.toString() === field.value)
                      ? `${
                          customers.find((c) => c.id.toString() === field.value)
                            ?.firstName
                        } ${
                          customers.find((c) => c.id.toString() === field.value)
                            ?.lastName
                        }`
                      : "Customer not found"
                  }
                  disabled
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfPayment"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light">
                Date of Payment
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl className="md:w-[400px]">
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(parseISO(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? parseISO(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date ? date.toISOString() : "")
                    }
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="modeOfPayment"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light">
                Mode of Payment
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="md:w-[400px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Mode of Payment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referenceNumber"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light">
                Reference Number
              </FormLabel>
              <FormControl className="md:w-[400px]">
                <Input placeholder="Enter Reference Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentNumber"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light">
                Payment Number
              </FormLabel>
              <FormControl className="md:w-[400px]">
                <Input placeholder="Enter Payment Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <h1 className="md:text-2xl font-semibold mt-5">Invoices</h1>
        <Table className="md:w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Due Date</TableHead>
              <TableHead className="w-[250px]">Invoice Number</TableHead>
              <TableHead className="text-right w-[250px]">
                Invoice Amount
              </TableHead>
              <TableHead className="text-right">Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice, index) => (
              <TableRow key={index}>
                <TableCell>
                  {format(parseISO(invoice.dueDate), "PPP")}
                </TableCell>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell className="text-right">{invoice.total}</TableCell>
                <TableCell className="text-right">
                  <FormField
                    control={form.control}
                    name={`payments.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="flex justify-end items-end">
                        <FormControl>
                          <Input
                            className="text-right md:w-[200px]"
                            {...field}
                            onChange={(e) => {
                              const newAmount = parseFloat(e.target.value) || 0;
                              field.onChange(newAmount);
                              form.setValue(
                                `payments.${index}.invoiceId`,
                                Number(invoice.id)
                              );
                              const currentPayments =
                                form.getValues("payments");
                              const newTotal = currentPayments.reduce(
                                (sum, payment) => sum + (payment.amount || 0),
                                0
                              );
                              setTotal(newTotal);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                Total
              </TableCell>
              <TableCell className="text-right">₱{total.toFixed(2)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <footer className="fixed bottom-0 w-full flex py-5 space-x-4">
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="default"
                className="w-[150px]"
                onClick={() => setIsDialogOpen(true)}
              >
                Save
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save Changes</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to save these changes?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="w-[150px]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="w-[150px]"
                  onClick={form.handleSubmit(handleSubmit)}
                >
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Changes</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel? Unsaved changes will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Stay</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel}>
                  Discard
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </footer>
      </form>
    </Form>
  );
};

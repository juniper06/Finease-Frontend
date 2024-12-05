"use client";
import React, { useEffect, useState, useCallback } from "react";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { CalendarIcon, CirclePlus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Customer, getAllCustomers } from "@/actions/cfo/customer.action";
import { User, getUserData } from "@/actions/auth/user.action";
import { Item, getAllItems, getItem } from "@/actions/cfo/item.action";
import { editInvoice, getInvoice } from "@/actions/cfo/invoice.action";

const formSchema = z.object({
  customerId: z.string({
    message: "Customer is Required",
  }),
  invoiceNumber: z.string({
    message: "Invoice No. is Required",
  }),
  dueDate: z.string().datetime({
    message: "Due Date is Required",
  }),
  items: z.array(
    z.object({
      itemId: z.string({
        message: "Item is Required",
      }),
      quantity: z.coerce.number(),
      price: z.coerce.number(),
      amount: z.coerce.number(),
    })
  ),
  total: z.number(),
});

export const EditInvoiceForm = ({ invoiceId }: {invoiceId: string}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: "",
      invoiceNumber: "",
      dueDate: "",
      items: [
        {
          itemId: "",
          quantity: 1.0,
          price: 0.0,
          amount: 0.0,
        },
      ],
      total: 0,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const addRow = () => {
    append({
      itemId: "",
      quantity: 1.0,
      price: 0.0,
      amount: 0.0,
    });
  };

  const calculateTotal = () => {
    const items = form.getValues("items");
    const total = items.reduce((acc, item) => acc + item.amount, 0);
    form.setValue("total", total);
  };

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

        const [fetchedItems, fetchedCustomers] = await Promise.all([
          getAllItems(userData.id),
          getAllCustomers(userData.id),
        ]);

        if ("error" in fetchedItems) {
          toast({
            description: fetchedItems.error,
          });
        } else {
          setItems(fetchedItems);
        }

        if ("error" in fetchedCustomers) {
          toast({
            description: fetchedCustomers.error,
          });
        } else {
          setCustomers(fetchedCustomers);
        }

        if (invoiceId) {
          const fetchedInvoice = await getInvoice(invoiceId);
          if ("error" in fetchedInvoice) {
            toast({
              description: fetchedInvoice.error,
            });
          } else {
            setInvoice(fetchedInvoice);
            form.reset(fetchedInvoice)
          }
        } else {
          console.error("Invoice ID is not provided");
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
  }, [invoiceId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleItemChange = async (itemId: string, index: number) => {
    if (!itemId) return;

    const item = await getItem(itemId);
    if ("error" in item) {
      toast({
        description: item.error,
      });
      return;
    }

    const quantity = form.getValues(`items.${index}.quantity`);
    const price = item.price;
    const amount = quantity * price;

    update(index, { itemId, quantity, price, amount });
    calculateTotal();
  };

  const handleQuantityChange = (quantity: number, index: number) => {
    const itemId = form.getValues(`items.${index}.itemId`);
    const price = form.getValues(`items.${index}.price`);
    const amount = quantity * price;

    update(index, { itemId, quantity, price, amount });
    calculateTotal();
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        description: "You need to be logged in to edit an invoice.",
      });
      return;
    }

    const total = values.items.reduce((acc, item) => acc + item.amount, 0);

    const invoiceData = {
      ...values,
      userId: user.id,
      customerId: parseInt(values.customerId),
      dueDate: new Date(values.dueDate).toISOString(),
      total,
    };

    const response = await editInvoice(invoiceId, invoiceData);
    if (response.error) {
      toast({
        description: "Failed to edit invoice.",
      });
    } else {
      toast({
        description: "Invoice edited successfully!",
      });
      form.reset();
      setIsDialogOpen(false);
      router.push("/invoices");
    }
  };

  const handleCancel = () => {
    form.reset();
    toast({
      description: "Changes have been discarded.",
    });
    router.push("/invoices");
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl className="md:w-[400px]">
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={String(customer.id)}>
                    {customer.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="invoiceNumber"
        render={({ field }) => (
          <FormItem className="md:flex md:items-center">
            <FormLabel className="md:w-60 md:text-lg font-light">
              Invoice #
            </FormLabel>
            <FormControl>
              <Input disabled required {...field} className="md:w-[400px]" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem className="md:flex md:items-center">
            <FormLabel className="md:w-60 md:text-lg font-light">
              Due Date
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "md:w-[400px] pl-3 text-left font-normal",
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
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
      <Table className="md:w-[1500px]">
        <TableHeader>
          <TableRow>
            <TableHead className="md:w-[500px]">Item Name</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right md:w-[300px]">Price</TableHead>
            <TableHead className="text-right md:w-[300px]">Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell className="w-[500px]">
                <FormField
                  control={form.control}
                  name={`items.${index}.itemId`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleItemChange(value, index);
                        }}
                        value={field.value}
                      >
                        <FormControl className="border-none ">
                          <SelectTrigger>
                            <SelectValue placeholder="Select an item" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {items.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="md:w-60 text-right">
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          className="text-right border-none md:w-[300px]"
                          required
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleQuantityChange(
                              Number(e.target.value),
                              index
                            );
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`items.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled
                          className="text-right border-none md:w-[300px]"
                          required
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`items.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled
                          className="text-right border-none md:w-[300px]"
                          required
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    remove(index);
                    calculateTotal();
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled
                        className="text-right border-none md:w-[300px]"
                        required
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Button type="button" onClick={addRow} className="mt-4 w-[200px]">
        <CirclePlus className="h-6 w-6 mr-3" /> Add Row
      </Button>
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

"use client";
import React, { useEffect, useState } from "react";
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
  TableCaption,
  TableCell,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, CirclePlus, CirclePlusIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { AddCategory } from "./add-category";
import { User, getUserData } from "@/actions/auth/user.action";
import { Category, getAllCategory } from "@/actions/cfo/category.action";
import { editExpenses, getExpenses } from "@/actions/cfo/expenses.action";

const formSchema = z.object({
  transactionDate: z.string().datetime({
    message: "Transaction Date is Required",
  }),
  categoryId: z.string({
    message: "Category is Required",
  }),
  amount: z.coerce.number(),
  referenceNumber: z.string({
    message: "Rereference No. is Required",
  }),
  modeOfPayment: z.string({
    message: "Mode of Payment is Required",
  }),
});

export const EditExpensesForm = ({ expensesId }: { expensesId: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<any>(null);
  const [expenses, setExpenses] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionDate: "",
      categoryId: "",
      amount: 0,
      referenceNumber: "",
      modeOfPayment: "",
    },
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        setUser(userData);
        const fetchedCategories = await getAllCategory(userData.id);
        if (fetchedCategories.error) {
          toast({
            description: fetchedCategories.error,
          });
        } else {
          setCategories(fetchedCategories);
        }
      } catch (error) {
        toast({
          description: "Failed to fetch user data.",
        });
      }
    }
    async function fetchExpensesData() {
      if (expensesId) {
        try {
          const fetchedExpenses = await getExpenses(expensesId);
          if (fetchedExpenses.error) {
            toast({
              description: fetchedExpenses.error,
            });
          } else {
            setExpenses(fetchedExpenses);
            form.reset(fetchedExpenses);
          }
        } catch (error) {
          console.error("Failed to fetch expenses", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Expenses ID is not provided");
        setLoading(false);
      }
    }
    fetchUserData();
    fetchExpensesData();
  }, [expensesId, form, toast]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user) {
        toast({
          description: "You need to be logged in to edit an expense.",
        });
        return;
      }
  
      const expensesData = {
        ...values,
        userId: user.id,
        category: { id: parseInt(values.categoryId) }, // Use category object instead of categoryId
        transactionDate: new Date(values.transactionDate).toISOString(),
      };
  
      console.log('Expenses data to be sent:', expensesData); // For debugging
  
      const response = await editExpenses(expensesId, expensesData);
      if (response.error) {
        toast({
          description: `Failed to update expense: ${response.error}`,
        });
      } else {
        toast({
          description: "Expenses updated successfully!",
        });
        form.reset();
        setIsDialogOpen(false);
        router.push("/expenses-tracking");
      }
    } catch (error) {
      console.error("Failed to update expenses:", error);
      toast({
        description: "An unexpected error occurred while updating the expense.",
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    toast({
      description: "Changes have been discarded.",
    });
    router.push("/expenses-tracking");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!expenses) {
    return <div>Expenses not found</div>;
  }

  return (
    <Form {...form}>
      <form
        className="w-auto flex flex-col gap-5 pb-[150px]"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="transactionDate"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light">
                Date of Transaction
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
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light">
                Category Name:
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="md:w-[400px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                  <Separator />
                  <Dialog>
                    <DialogTrigger className="p-2 flex gap-2 justify-center items-center">
                      <CirclePlusIcon className="h-5 w-5" />
                      New Category
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-start font-bold">
                          New Category
                        </DialogTitle>
                        <Separator />
                        <DialogDescription className="flex justify-center items-center">
                          <AddCategory />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light">
                Amount ( ₱ )
              </FormLabel>
              <FormControl>
                <Input required {...field} className="md:w-[400px]" />
              </FormControl>
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
                    <SelectValue placeholder="Select a mode of payment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="CreditCard">Credit Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referenceNumber"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light">
                Reference #
              </FormLabel>
              <FormControl>
                <Input required {...field} className="md:w-[400px]" />
              </FormControl>
            </FormItem>
          )}
        />
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

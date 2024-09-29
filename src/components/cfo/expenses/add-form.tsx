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
import { cn, formatNumber, generateStartupCode } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, CirclePlus, CirclePlusIcon, Trash, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { AddCategory } from "./add-category";
import { User, getUserData } from "@/actions/auth/user.action";
import {
  Category,
  deleteCategory,
  getAllCategory,
} from "@/actions/cfo/category.action";
import { addExpenses } from "@/actions/cfo/expenses.action";

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

export const AddExpensesForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionDate: "",
      categoryId: "",
      amount: 0,
      referenceNumber: generateStartupCode(),
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
    fetchUserData();
  }, [toast]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        description: "You need to be logged in to create an expenses.",
      });
      return;
    }

    const expensesData = {
      ...values,
      userId: user.id,
      categoryId: parseInt(values.categoryId),
      transactionDate: new Date(values.transactionDate).toISOString(),
      startupId: user.startupId,
    };

    const response = await addExpenses(expensesData);
    if (response.error) {
      toast({
        description: "Failed to add Expenses",
      });
    } else {
      toast({
        description: "Expenses added successfully!",
      });
      form.reset();
      setIsDialogOpen(false);
      router.push("/expenses-tracking");
    }
  };

  const handleCancel = () => {
    form.reset();
    toast({
      description: "Changes have been discarded.",
    });
    router.push("/expenses-tracking");
  };

  const handleDeleteCategory = async (id: string) => {
    const response = await deleteCategory(id);
    if (response.error) {
      toast({
        description: response.error,
      });
    } else {
      toast({
        description: "Category deleted successfully!",
      });
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    }
  };

  const refreshCategories = async () => {
    if (user) {
      const fetchedCategories = await getAllCategory(user.id);
      if (fetchedCategories.error) {
        toast({
          description: fetchedCategories.error,
        });
      } else {
        setCategories(fetchedCategories);
      }
    }
  };

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
                    <div
                      key={category.id}
                      className="flex justify-between items-center"
                    >
                      <SelectItem value={String(category.id)}>
                        {category.categoryName}
                      </SelectItem>
                      <Trash2Icon
                        className="h-5 w-5 cursor-pointer text-red-500"
                        onClick={() => handleDeleteCategory(category.id)}
                      />
                    </div>
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
                          <AddCategory onCategoryAdded={refreshCategories}/>
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
                <Input
                  required
                  {...field}
                  className="md:w-[400px]"
                  value={formatNumber(field.value)}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "");
                    field.onChange(parseFloat(rawValue) || 0);
                  }}
                />
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
                <Input required {...field} className="md:w-[400px]" readOnly/>
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

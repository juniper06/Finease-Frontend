"use client";
import * as z from "zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserData, User } from "@/actions/auth/user.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber, cn, generateStartupCode, formatNumberForInput } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { CalendarIcon, CirclePlus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { addBudgetProposal } from "@/actions/cfo/budget-proposal.action";

const formSchema = z.object({
  proposalTitle: z.string({
    message: "Proposal Title is Required!",
  }),
  proposalNumber: z.string({
    message: "Proposal  Number is Required!",
  }),
  totalBudget: z.coerce.number({
    message: "Total Budget is Required",
  }),
  budgetPeriod: z.string({
    message: "Budget Period is Required!",
  }),
  startDate: z.string().datetime({
    message: "Start Date is Required",
  }),
  endDate: z.string().datetime({
    message: "End Date is Required",
  }),
  budgetBreakdown: z.array(
    z.object({
      proposalCategory: z.string({
        message: "Proposal Category is Required",
      }),
      allocatedAmount: z.coerce.number({
        message: "Allocated Amount is Required!",
      }),
      description: z.string({
        message: "Description is Required!",
      }),
    })
  ),
  justification: z.string({
    message: "Description is Required!",
  }),
  potentialRisk: z.string({
    message: "Potential Risk is Required!",
  }),
  strategy: z.string({
    message: "Strategy is Required!",
  }),
  alternative: z.string({
    message: "Alternative is Required!",
  }),
});

export default function BudgetProposalForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proposalTitle: "",
      proposalNumber: generateStartupCode(),
      totalBudget: 0,
      budgetPeriod: "",
      startDate: "",
      endDate: "",
      budgetBreakdown: [
        {
          proposalCategory: "",
          allocatedAmount: 0,
          description: "",
        },
      ],
      justification: "",
      potentialRisk: "",
      strategy: "",
      alternative: "",
    },
  });

  const { watch, setValue } = form;

  const calculateTotalBudget = (budgetBreakdown: any[]) => {
    return budgetBreakdown.reduce(
      (total, item) => total + (Number(item.allocatedAmount) || 0),
      0
    );
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.startsWith("budgetBreakdown")) {
        const newTotal = calculateTotalBudget(value.budgetBreakdown || []);
        setValue("totalBudget", newTotal);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (error) {
        toast({
          description: "Failed to fetch user data.",
        });
      }
    }
    fetchUserData();
  }, [toast]);

  const {
    fields: budgetBreakdownFields,
    append: appendBudgetBreakdown,
    remove: removeBudgetBreakdown,
  } = useFieldArray({
    control: form.control,
    name: "budgetBreakdown",
  });

  const addBudgetBreakdownRow = () => {
    appendBudgetBreakdown({
      proposalCategory: "",
      allocatedAmount: 0,
      description: "",
    });
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        description: "You need to be logged in to create a budget proposal.",
      });
      return;
    }

    const budgetProposalData = {
      ...values,
      userId: user.id,
      startupId: user.startupId,
      totalBudget: Number(values.totalBudget),
      budgetBreakdowns: values.budgetBreakdown.map((item) => ({
        ...item,
        allocatedAmount: Number(item.allocatedAmount),
      })),
    };

    try {
      const response = await addBudgetProposal(budgetProposalData);
      if (response.error) {
        toast({
          title: "Error",
          description:
            response.error ||
            "Failed to add Budget Proposal. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          description: "Budget Proposal added successfully!",
        });
        form.reset();
        setIsDialogOpen(false);
        router.push("/budget-proposal");
      }
    } catch (error) {
      console.error("Error submitting budget proposal:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    toast({
      description: "Changes have been discarded.",
    });
    router.push("/budget-proposals");
  };

  return (
    <Form {...form}>
      <form
        className="w-auto flex flex-col gap-5 pb-[150px]"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="proposalTitle"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Proposal Title
              </FormLabel>
              <FormControl>
                <Input className="md:w-[400px]" required {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proposalNumber"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Proposal Number
              </FormLabel>
              <FormControl>
                <Input className="md:w-[400px]" required {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalBudget"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Total Budget
              </FormLabel>
              <FormControl>
                <Input
                  className="md:w-[400px]"
                  disabled
                  {...field}
                  value={formatNumber(field.value || 0)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budgetPeriod"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Budget Period
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="md:w-[400px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a budget period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Annual">Annual</SelectItem>
                  <SelectItem value="Project-based">Project-based</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="flex gap-5">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-60 md:text-lg font-light">
                  Start Date
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
            name="endDate"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-60 md:text-lg font-light">
                  End Date
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
        </div>
        <h1 className="mt-5 text-[23px]">Budget Breakdown</h1>
        <Table className="md:w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">S.No</TableHead>
              <TableHead>Department/Category</TableHead>
              <TableHead>Allocated Amount</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetBreakdownFields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`budgetBreakdown.${index}.proposalCategory`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="border-none " required {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`budgetBreakdown.${index}.allocatedAmount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="border-none"
                            required
                            {...field}
                            value={formatNumberForInput(field.value)}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/,/g, "");
                              const numericValue = parseFloat(rawValue) || 0;
                              field.onChange(numericValue);
                              const newTotal = calculateTotalBudget(
                                form.getValues().budgetBreakdown
                              );
                              form.setValue("totalBudget", newTotal);
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
                    name={`budgetBreakdown.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            className="border-none "
                            required
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeBudgetBreakdown(index)}
                  >
                    <Trash2 color="#ff0000" className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          type="button"
          variant="ghost"
          onClick={addBudgetBreakdownRow}
          className=" w-[220px] mb-5"
        >
          <CirclePlus className="h-5 w-5 mr-3" /> Add Budget Breakdown
        </Button>
        <div className="flex gap-5">
          <FormField
            control={form.control}
            name="justification"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                  Justification
                </FormLabel>
                <FormControl>
                  <Textarea className="md:w-[400px]" required {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="potentialRisk"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                  Potential Risk
                </FormLabel>
                <FormControl>
                  <Textarea className="md:w-[400px]" required {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-5">
          <FormField
            control={form.control}
            name="strategy"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                  Strategy
                </FormLabel>
                <FormControl>
                  <Textarea className="md:w-[400px]" required {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alternative"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                  Alternative
                </FormLabel>
                <FormControl>
                  <Textarea className="md:w-[400px]" required {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

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
}

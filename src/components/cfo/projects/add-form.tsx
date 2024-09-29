"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { getUserData, User } from "@/actions/auth/user.action";
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
import { Input } from "@/components/ui/input";
import { Customer, getAllCustomers } from "@/actions/cfo/customer.action";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { addProject } from "@/actions/cfo/project.action";
import { formatNumber } from "@/lib/utils";

const formSchema = z.object({
  projectName: z.string({
    message: "Project Name is Required!",
  }),
  projectCode: z.string({
    message: "Project Code is Required!",
  }),
  customerId: z.string({
    message: "Customer is Required!",
  }),
  billingMethod: z.string({
    message: "Billing Method is Required!",
  }),
  description: z.string({
    message: "description is Required!",
  }),
  users: z.array(
    z.object({
      userName: z.string(),
      userEmail: z.string(),
    })
  ),
  resources: z.array(
    z.object({
      resourceCategory: z.string(),
      subCategory: z.string(),
      expense: z.number(),
    })
  ),
  totalExpenses: z.number(),
});

export const AddProjectForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      projectCode: "",
      customerId: "",
      billingMethod: "",
      description: "",
      users: [
        {
          userName: "",
          userEmail: "",
        },
      ],
      resources: [
        {
          resourceCategory: "",
          subCategory: "",
          expense: 0,
        },
      ],
      totalExpenses: 0,
    },
  });

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

  const fetchData = async () => {
    try {
      setLoading(true);

      const userData = await getUserData();
      if ("error" in userData) {
        toast({
          description: userData.error,
        });
      } else {
        setUser(userData);

        const fetchedCustomers = await getAllCustomers(userData.id);
        if ("error" in fetchedCustomers) {
          toast({
            description: fetchedCustomers.error,
          });
        } else {
          setCustomers(fetchedCustomers);
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
  };

  useEffect(() => {
    fetchData();
  }, [toast]);

  const {
    fields: userFields,
    append: appendUser,
    remove: removeUser,
  } = useFieldArray({
    control: form.control,
    name: "users",
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: "resources",
  });

  const addUserRow = () => {
    appendUser({
      userName: "",
      userEmail: "",
    });
  };

  const addProjectRow = () => {
    appendProject({
      resourceCategory: "",
      subCategory: "",
      expense: 0,
    });
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        description: "You need to be logged in to create a project.",
      });
      return;
    }

    try {
      const projectData = {
        ...values,
        userId: user.id,
        startupId: user.startupId,
        customerId: parseInt(values.customerId),
        totalExpenses: values.totalExpenses, // Include the total expenses
      };

      const response = await addProject(projectData);
      if ("error" in response) {
        throw new Error(response.error);
      }

      toast({
        description: "Project added successfully!",
      });
      form.reset();
      setIsDialogOpen(false);
      router.push("/projects");
    } catch (error) {
      console.error("Failed to add project:", error);
      toast({
        description:
          error instanceof Error ? error.message : "Failed to add project.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    toast({
      description: "Changes have been discarded.",
    });
    router.push("/items");
  };

  useEffect(() => {
    const total = form
      .watch("resources")
      .reduce((sum, resource) => sum + (resource.expense || 0), 0);
    form.setValue("totalExpenses", total);
  }, [form.watch("resources")]);

  return (
    <Form {...form}>
      <form
        className="w-auto flex flex-col gap-5 pb-[150px]"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Project Name
              </FormLabel>
              <FormControl>
                <Input className="md:w-[400px]" required {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectCode"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Project Code
              </FormLabel>
              <FormControl>
                <Input className="md:w-[400px]" required {...field} />
              </FormControl>
            </FormItem>
          )}
        />
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
                      {customer.firstName} {customer.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="billingMethod"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Billing Method
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="md:w-[400px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a billing method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Fixed Cost for Project">
                    Fixed Cost for Project
                  </SelectItem>
                  <SelectItem value="Based on Project Hours">
                    Based on Project Hours
                  </SelectItem>
                  <SelectItem value="Based on Task Hours">
                    Based on Task Hours
                  </SelectItem>
                  <SelectItem value="Based on Staff Hours">
                    Based on Staff Hours
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light">
                Description
              </FormLabel>
              <FormControl>
                <Textarea required {...field} className="md:w-[400px]" />
              </FormControl>
            </FormItem>
          )}
        />
        <h1 className="mt-5 text-[23px]">Users</h1>
        <Table className="md:w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">S.No</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userFields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`users.${index}.userName`}
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
                    name={`users.${index}.userEmail`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="border-none " required {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeUser(index)}
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
          onClick={addUserRow}
          className=" w-[120px]"
        >
          <CirclePlus className="h-5 w-5 mr-3" /> Add Row
        </Button>
        <div className="md:w-[1000px]">
          <Separator />
        </div>
        <h1 className="mt-5 text-[23px]">Project Resources</h1>
        <Table className="md:w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">S.No</TableHead>
              <TableHead>Cost Category</TableHead>
              <TableHead>Cost Subcategory</TableHead>
              <TableHead>Expense</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectFields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`resources.${index}.resourceCategory`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue(
                                `resources.${index}.subCategory`,
                                ""
                              );
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl className="md:w-[400px]">
                              <SelectTrigger>
                                <SelectValue placeholder="Select Cost Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Personnel">
                                Personnel
                              </SelectItem>
                              <SelectItem value="Personnel Services">
                                Personnel Services
                              </SelectItem>
                              <SelectItem value="Equipment">
                                Equipment
                              </SelectItem>
                              <SelectItem value="Supplies">Supplies</SelectItem>
                              <SelectItem value="Travel">Travel</SelectItem>
                              <SelectItem value="Marketing">
                                Marketing
                              </SelectItem>
                              <SelectItem value="Consulting">
                                Consulting
                              </SelectItem>
                              <SelectItem value="MOOE">
                                Maintenance and Other Operating Expenses (MOOE)
                              </SelectItem>
                              <SelectItem value="Equipment/Capital Outlay">
                                Equipment/Capital Outlay
                              </SelectItem>
                              <SelectItem value="Miscellaneous">
                                Miscellaneous
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`resources.${index}.subCategory`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="md:w-[400px]">
                              <SelectTrigger>
                                <SelectValue placeholder="Select Cost Subcategory" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(() => {
                                switch (
                                  form.watch(
                                    `resources.${index}.resourceCategory`
                                  )
                                ) {
                                  case "Personnel":
                                    return (
                                      <>
                                        <SelectItem value="Salaries">
                                          Salaries
                                        </SelectItem>
                                        <SelectItem value="Benefits">
                                          Benefits
                                        </SelectItem>
                                        <SelectItem value="Training">
                                          Training
                                        </SelectItem>
                                      </>
                                    );
                                  case "Personnel Services":
                                    return (
                                      <>
                                        <SelectItem value="Contract Labor">
                                          Contract Labor
                                        </SelectItem>
                                        <SelectItem value="Temporary Staff">
                                          Temporary Staff
                                        </SelectItem>
                                        <SelectItem value="Overtime Pay">
                                          Overtime Pay
                                        </SelectItem>
                                      </>
                                    );
                                  case "Equipment":
                                    return (
                                      <>
                                        <SelectItem value="Hardware">
                                          Hardware
                                        </SelectItem>
                                        <SelectItem value="Software">
                                          Software
                                        </SelectItem>
                                        <SelectItem value="Maintenance">
                                          Maintenance
                                        </SelectItem>
                                      </>
                                    );
                                  case "Supplies":
                                    return (
                                      <>
                                        <SelectItem value="Office Supplies">
                                          Office Supplies
                                        </SelectItem>
                                        <SelectItem value="Project-Specific">
                                          Project-Specific
                                        </SelectItem>
                                      </>
                                    );
                                  case "Travel":
                                    return (
                                      <>
                                        <SelectItem value="Transportation">
                                          Transportation
                                        </SelectItem>
                                        <SelectItem value="Accommodation">
                                          Accommodation
                                        </SelectItem>
                                        <SelectItem value="Meals & Incidentals">
                                          Meals & Incidentals
                                        </SelectItem>
                                      </>
                                    );
                                  case "Marketing":
                                    return (
                                      <>
                                        <SelectItem value="Advertising">
                                          Advertising
                                        </SelectItem>
                                        <SelectItem value="Promotions">
                                          Promotions
                                        </SelectItem>
                                      </>
                                    );
                                  case "Consulting":
                                    return (
                                      <>
                                        <SelectItem value="Professional Services">
                                          Professional Services
                                        </SelectItem>
                                        <SelectItem value="Legal Fees">
                                          Legal Fees
                                        </SelectItem>
                                      </>
                                    );
                                  case "MOOE":
                                    return (
                                      <>
                                        <SelectItem value="Repairs">
                                          Repairs
                                        </SelectItem>
                                        <SelectItem value="Utilities">
                                          Utilities
                                        </SelectItem>
                                        <SelectItem value="Communication">
                                          Communication
                                        </SelectItem>
                                      </>
                                    );
                                  case "Equipment/Capital Outlay":
                                    return (
                                      <>
                                        <SelectItem value="New Equipment">
                                          New Equipment
                                        </SelectItem>
                                        <SelectItem value="Furniture">
                                          Furniture
                                        </SelectItem>
                                      </>
                                    );
                                  case "Miscellaneous":
                                    return (
                                      <>
                                        <SelectItem value="Contingency Fund">
                                          Contingency Fund
                                        </SelectItem>
                                        <SelectItem value="Other Expenses">
                                          Other Expenses
                                        </SelectItem>
                                      </>
                                    );
                                  default:
                                    return null;
                                }
                              })()}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`resources.${index}.expense`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="w-[200px] text-right"
                            required
                            {...field}
                            value={formatNumber(field.value)}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/,/g, "");
                              const numValue = parseFloat(rawValue) || 0;
                              field.onChange(numValue);

                              const total = form
                                .getValues("resources")
                                .reduce(
                                  (sum, resource) =>
                                    sum + (resource.expense || 0),
                                  0
                                );
                              form.setValue("totalExpenses", total);
                            }}
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
                    onClick={() => removeProject(index)}
                  >
                    <Trash2 color="#ff0000" className="h-4 w-4" />
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
                  name="totalExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled
                          className="text-right border-none md:w-[200px]"
                          value={formatNumber(field.value)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <Button
          type="button"
          variant="ghost"
          onClick={addProjectRow}
          className=" w-[120px]"
        >
          <CirclePlus className="h-5 w-5 mr-3" /> Add Row
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

"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, useToast } from "@/components/ui/use-toast";
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
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { editCustomer, getAllCustomers, getCustomer } from "@/actions/cfo/customer.action";

const formSchema = z.object({
  type: z.string({
    message: "Please select a Customer Type.",
  }),
  firstName: z.string().min(1, {
    message: "Customer First Name is Required",
  }),
  lastName: z.string().min(1, {
    message: "Customer Last Name is Required",
  }),
  companyName: z.string().min(1, {
    message: "Company Name is Required",
  }),
  email: z.string().min(1, {
    message: "Customer Email is Required",
  }),
  phoneNumber: z.string().min(1, {
    message: "Customer Phone Number is Required",
  }).length(11, {
    message: "Customer Phone Number must be exactly 11 digits",
  }),
  country: z.string().min(1, {
    message: "Customer Address is Required",
  }),
  city: z.string().min(1, {
    message: "City is Required",
  }),
  state: z.string().min(1, {
    message: "State is Required",
  }),
  zipCode: z.coerce.number({
    message: "Zip Code is Required",
  }),
});

export default function EditCustomerForm({
  customerId,
}: {
  customerId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      phoneNumber: "",
      country: "",
      city: "",
      state: "",
      zipCode: 0,
    },
  });

  useEffect(() => {
    if (customerId) {
      const fetchData = async () => {
        try {
          const fetchedCustomer = await getCustomer(customerId);
          if (fetchedCustomer.error) {
            toast({
              description: fetchedCustomer.error,
            });
          } else {
            setCustomer(fetchedCustomer);
            form.reset(fetchedCustomer);
          }
        } catch (error) {
          console.error("Failed to fetch customer", error);
          toast({
            description: "Failed to fetch customer data.",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [customerId, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await editCustomer(customerId, values);
      if (response.error) {
        toast({
          description: response.error,
        });
      } else {
        toast({
          description: "Customer updated successfully!",
        });
        router.push("/customers");
      }
    } catch (error) {
      toast({
        description: "Failed to update customer",
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    toast({
      description: "Changes have been discarded.",
    });
    router.push("/customers");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="md:grid md:grid-cols-2 mb-[80px]"
      >
        <div className="flex flex-col md:gap-y-5 gap-y-3">
          <h1 className="md:text-xl md:font-bold md:mb-5 text-lg font-bold mb-5">Customer Details</h1>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  Customer Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl className="md:w-[500px]">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Customer Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  Company Name
                </FormLabel>
                <FormControl>
                  <Input required {...field} className="md:w-[500px]" />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-end gap-x-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="md:flex md:items-center">
                  <FormLabel className="md:w-48 md:text-lg font-light">
                    Customer Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="First Name"
                      {...field}
                      className="md:w-60 w-40"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      required
                      placeholder="Last Name"
                      {...field}
                      className="md:w-60 w-40"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  Customer Email
                </FormLabel>
                <FormControl>
                  <Input required {...field} className="md:w-[500px]" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  Customer Phone
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="Mobile Number"
                    {...field}
                    className="md:w-[500px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:gap-y-5 gap-y-3">
          <h1 className="md:text-xl md:font-bold md:mb-5 text-lg font-bold mb-5 mt-5">Customer Address</h1>
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  Address
                </FormLabel>
                <FormControl>
                  <Input required {...field} className="md:w-[500px]" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  City
                </FormLabel>
                <FormControl>
                  <Input required {...field} className="md:w-[500px]" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  State
                </FormLabel>
                <FormControl>
                  <Input required {...field} className="md:w-[500px]" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  Zip Code
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    {...field}
                    className="md:w-[500px]"
                  />
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
              <AlertDialogFooter className="flex flex-row gap-5">
                <AlertDialogCancel className="w-full h-full">Stay</AlertDialogCancel>
                <AlertDialogAction className="w-full h-full" onClick={handleCancel}>
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

"use client";
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
import { User, getUserData } from "@/actions/auth/user.action";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addCustomer } from "@/actions/cfo/customer.action";
import { render } from "react-dom";

const formSchema = z.object({
  type: z.string().nonempty({ message: "Please select a Customer Type." }),
  firstName: z
    .string()
    .min(1, { message: "Customer First Name is Required" })
    .regex(/^[a-zA-Z\s-]+$/, {
      message:
        "First Name should only contain alphabetic characters, spaces, or hyphens.",
    }),
  lastName: z
    .string()
    .min(1, { message: "Customer Last Name is Required" })
    .regex(/^[a-zA-Z\s-]+$/, {
      message:
        "Last Name should only contain alphabetic characters, spaces, or hyphens.",
    }),
  companyName: z
    .string()
    .min(1, { message: "Company Name is Required" })
    .regex(/^[a-zA-Z0-9\s-]+$/, {
      message: "Company Name should not contain special characters.",
    }),
  email: z
    .string()
    .min(1, { message: "Customer Email is Required" })
    .email({ message: "Please enter a valid email." }),
  phoneNumber: z
    .string()
    .min(1, { message: "Customer Phone Number is Required" })
    .regex(/^\d+$/, { message: "Phone Number should contain only digits." }),
  country: z
    .string()
    .min(1, { message: "Country is Required" })
    .regex(/^[a-zA-Z\s-]+$/, {
      message:
        "Country should only contain alphabetic characters, spaces, or hyphens.",
    }),
  city: z
    .string()
    .min(1, { message: "City is Required" })
    .regex(/^[a-zA-Z\s-]+$/, {
      message:
        "City should only contain alphabetic characters, spaces, or hyphens.",
    }),
  state: z
    .string()
    .min(1, { message: "State is Required" })
    .regex(/^[a-zA-Z\s-]+$/, {
      message:
        "State should only contain alphabetic characters, spaces, or hyphens.",
    }),
  zipCode: z.coerce
    .number({ message: "Zip Code is Required" })
    .int({ message: "Zip Code must be a valid integer." }),
});

export default function CustomerForm() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const errors = form.formState.errors;

    // If there are validation errors, notify the user about them
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors)
        .map((error) => {
          return `${error?.message}`;
        })
        .join(", ");

      toast({
        description: `Fix the following errors: ${errorMessages}`,
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        description: "You need to be logged in to create a customer.",
        variant: "destructive",
      });
      return;
    }

    const customerData = {
      ...values,
      userId: user.id,
      startupId: user.startupId,
    };

    const response = await addCustomer(customerData);

    if (response.error) {
      toast({
        description: "Failed to add Customer. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        description: "Customer added successfully!",
      });
      form.reset();
      setIsDialogOpen(false);
      router.push("/customers");
    }
  };

  const handleCancel = () => {
    form.reset();
    toast({
      description: "Changes have been discarded.",
    });
    router.push("/customers");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="md:grid md:grid-cols-2 mb-[80px]"
      >
        <div className="flex flex-col md:gap-y-5 gap-y-3">
          <h1 className="md:text-xl md:font-bold md:mb-5 text-lg font-bold mb-5">
            Customer Details
          </h1>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="md:flex md:flex-col md:items-start">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  Customer Type
                </FormLabel>
                <Select
                  required
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                <FormMessage className="text-red-600 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="md:flex md:flex-col md:items-start">
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
                <FormItem className="md:flex md:flex-col md:items-start">
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
                  <FormMessage className="text-red-600 mt-1" />
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
                  <FormMessage className="text-red-600 mt-1" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="md:flex md:flex-col md:items-start">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  Customer Email
                </FormLabel>
                <FormControl>
                  <Input required {...field} className="md:w-[500px]" />
                </FormControl>
                <FormMessage className="text-red-600 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="md:flex md:flex-col md:items-start">
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
                <FormMessage className="text-red-600 mt-1" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:gap-y-5 gap-y-3">
          <h1 className="md:text-xl md:font-bold md:mb-5 text-lg font-bold mb-5 mt-5">
            Customer Address
          </h1>
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="md:flex md:flex-col md:items-start">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  Address
                </FormLabel>
                <FormControl>
                  <Input required {...field} className="md:w-[500px]" />
                </FormControl>
                <FormMessage className="text-red-600 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="md:flex md:flex-col md:items-start">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  City
                </FormLabel>
                <FormControl>
                  <Input required {...field} className="md:w-[500px]" />
                </FormControl>
                <FormMessage className="text-red-600 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="md:flex md:flex-col md:items-start">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  State
                </FormLabel>
                <FormControl>
                  <Input required {...field} className="md:w-[500px]" />
                </FormControl>
                <FormMessage className="text-red-600 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="md:flex md:flex-col md:items-start">
                <FormLabel className="md:w-48 md:text-lg font-light">
                  Zip Code
                </FormLabel>
                <FormControl>
                  <Input required {...field} className="md:w-[500px]" />
                </FormControl>
                <FormMessage className="text-red-600 mt-1" />
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
                <AlertDialogCancel className="w-full h-full">
                  Stay
                </AlertDialogCancel>
                <AlertDialogAction
                  className="w-full h-full"
                  onClick={handleCancel}
                >
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

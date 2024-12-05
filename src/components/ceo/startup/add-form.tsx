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
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { User, getUserData } from "@/actions/auth/user.action";
import { cn, generateStartupCode } from "@/lib/utils";
import { addStartup } from "@/actions/ceo/startup.action";
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
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  companyName: z.string({
    message: "Startup Name is Required",
  }),
  companyDescription: z.string({
    message: "Startup Description is Required",
  }),
  foundedDate: z.string({
    message: "Startup founded date is Required",
  }),
  typeOfCompany: z.string({
    message: "Startup Type is Required",
  }),
  numberOfEmployees: z.string({
    message: "No. of Employees is Required",
  }),
  phoneNumber: z.string({
    message: "Phone Number is Required",
  }),
  contactEmail: z.string({
    message: "Email is Required",
  }),
  industry: z.string({
    message: "Industry is Required",
  }),
  website: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedIn: z.string().optional(),
  startupCode: z.string({
    message: "Startup Code is Required",
  }),
});
export const AddStartupForm = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [displayValue, setDisplayValue] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyDescription: "",
      foundedDate: "",
      typeOfCompany: "",
      numberOfEmployees: "",
      phoneNumber: "",
      contactEmail: "",
      industry: "",
      website: "",
      facebook: "",
      twitter: "",
      instagram: "",
      linkedIn: "",
      startupCode: generateStartupCode(),
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
    try {
      if (!user) {
        toast({
          description: "You need to be logged in to create a startup.",
        });
        return;
      }

      const startupData = { ...values, userId: user.id };
      const response = await addStartup(startupData);

      if (response.error) {
        toast({
          description: "Failed to add Startup",
        });
        console.error("Error adding startup:", response.error);
      } else {
        toast({
          description: "Startup added successfully!",
        });
        form.reset();
        setIsDialogOpen(false);
        router.push("/ceo/startups");
      }
    } catch (error) {
      toast({ description: `Submission error: ${error}` });
      console.error("Submission error:", error);
    }
  };

  const handleCancel = () => {
    form.reset();
    toast({
      description: "Changes have been discarded.",
    });
    router.push("/ceo/startups");
  };

  return (
    <Form {...form}>
      <form
        className="w-auto flex flex-col gap-5 pb-[150px]"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Startup Name
              </FormLabel>
              <FormControl>
                <Input className="md:w-[400px]" required {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyDescription"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light">
                Startup Description
              </FormLabel>
              <FormControl>
                <Textarea required {...field} className="md:w-[400px]" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-end gap-x-5">
          <FormField
            control={form.control}
            name="foundedDate"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-60 md:text-lg font-light">
                  Founded Date
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
            name="typeOfCompany"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                  Type of Company
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="md:w-[400px]">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="profit">Profit</SelectItem>
                    <SelectItem value="non-profit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-600 mt-1" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-end gap-x-5">
          <FormField
            control={form.control}
            name="numberOfEmployees"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                  No. of Employees
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="md:w-[400px]">
                    <SelectTrigger>
                      <SelectValue placeholder="Select No. of employees" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lessthan10">Less than 10</SelectItem>
                    <SelectItem value="tenTofifty">10 - 50</SelectItem>
                    <SelectItem value="fiftyTohundred">50 - 100</SelectItem>
                    <SelectItem value="hundredTotwohundred">
                      100 - 200
                    </SelectItem>
                    <SelectItem value="twohundredTofivehundred">
                      200 - 500
                    </SelectItem>
                    <SelectItem value="abovethousand">
                      1000 and above
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-600 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="md:flex md:items-center">
                <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input className="md:w-[400px]" required {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Contact Email
              </FormLabel>
              <FormControl>
                <Input className="md:w-[400px]" required {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Industry
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="md:w-[400px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select an Industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[
                    "Artificial Intelligence",
                    "Software",
                    "Hardware",
                    "Cybersecurity",
                    "Blockchain",
                    "Gaming",
                    "Biotechnology",
                    "Space",
                    "Renewable Energy",
                    "Technology",
                    "Telecommunications",
                    "E-commerce",
                    "Media",
                    "Entertainment",
                    "Finance",
                    "Healthcare",
                    "Retail",
                    "Automotive",
                    "Education",
                    "Hospitality",
                    "Manufacturing",
                    "Real Estate",
                    "Food and Beverage",
                    "Travel",
                    "Fashion",
                    "Energy",
                    "Construction",
                    "Agriculture",
                    "Transportation",
                    "Pharmaceuticals",
                    "Environmental",
                    "Fitness",
                    "Consulting",
                    "Government",
                    "Non-profit",
                    "Insurance",
                    "Legal",
                    "Marketing",
                    "Sports",
                    "Beauty",
                    "Design",
                  ].map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <Separator />
        <h1 className="text-lg font-semibold md:text-xl w-full">Links</h1>
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Website
              </FormLabel>
              <FormControl>
                <Input className="md:w-[400px]" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Facebook
              </FormLabel>
              <FormControl>
                <Input className="md:w-[400px]" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitter"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Twitter
              </FormLabel>
              <FormControl>
                <Input className="md:w-[400px]" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Instagram
              </FormLabel>
              <FormControl>
                <Input className="md:w-[400px]" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedIn"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                LinkedIn
              </FormLabel>
              <FormControl>
                <Input className="md:w-[400px]" {...field} />
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

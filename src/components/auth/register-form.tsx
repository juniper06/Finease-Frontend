"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";
import { addUser } from "@/actions/auth/user.action";
import { useToast } from "../ui/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Validation schema using Zod
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character"
  )
  .regex(/[0-9]/, "Password must contain at least one number");

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.string().min(1, "Role is required"),
    startupCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    if (data.role === "CFO" && !data.startupCode) {
      return false;
    }
    return true;
  }, {
    message: "Startup Code is required for CFO role",
    path: ["startupCode"],
  });

type FormSchemaType = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const [isCFO, setIsCFO] = useState(false); // Toggle startup code input based on role
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      startupCode: "", // optional for non-CFO roles
    },
  });

  const handleSubmit = async (values: FormSchemaType) => {
    const isPendingApproval = values.role === "CEO"; // Mark CEO role for admin approval

    const result = await addUser({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      role: values.role,
      startupCode: values.role === "CFO" ? values.startupCode : undefined,
      status: isPendingApproval ? "PENDING" : "ACTIVE", // CEO requests as pending
    });

    if (result.error) {
      if (result.error === "Invalid startup code.") {
        toast({ description: "Invalid Startup Code!" });
        form.setError("startupCode", { type: "manual", message: "Invalid Startup Code" });
      } else if (result.error === "Email already exists.") {
        toast({ description: "Email already exists!" });
        form.setError("email", { type: "manual", message: "Email already exists" });
      }
      return;
    }

    toast({ description: isPendingApproval ? "Request submitted for approval!" : "Account created successfully!" });
    router.push("/login");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input required type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input required type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setIsCFO(value === "CFO"); // Show Startup Code field for CFO
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GUEST">Guest</SelectItem>
                        <SelectItem value="CEO">CEO</SelectItem>
                        <SelectItem value="CFO">CFO</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {isCFO && (
                <FormField
                  control={form.control}
                  name="startupCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Startup Code</FormLabel>
                      <FormControl>
                        <Input required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

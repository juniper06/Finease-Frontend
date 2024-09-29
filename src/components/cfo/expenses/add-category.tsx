import { addCategory } from "@/actions/cfo/category.action";
import { User, getUserData } from "@/actions/auth/user.action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  categoryName: z.string({
    message: "Category Name is Required",
  }),
});

interface AddCategoryProps {
  onCategoryAdded?: () => Promise<void>;
}

export const AddCategory: React.FC<AddCategoryProps> = ({ onCategoryAdded }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
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
    if (!user) {
      toast({
        description: "You need to be logged in to create a category.",
      });
      return;
    }
    const categoryData = {
      ...values,
      userId: user.id,
    };
    const response = await addCategory(categoryData);
    if (response.error) {
      toast({
        description: "Failed to add Category",
      });
    } else {
      toast({
        description: "Category added successfully!",
      });
      form.reset();
      await onCategoryAdded?.(); // Call the callback function to refresh categories
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="md:w-60 md:text-lg ">
                Category Name
              </FormLabel>
              <FormControl>
                <Input required {...field} className="md:w-[400px]" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-10 gap-5">
          <Button variant="outline" className="w-[100px]">Cancel</Button>
          <Button className="w-[100px]" onClick={form.handleSubmit(handleSubmit)}>Add</Button>
        </div>
      </form>
    </Form>
  );
};

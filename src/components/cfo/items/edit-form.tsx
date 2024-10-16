"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { getItem, editItem } from "@/actions/cfo/item.action";
import { formatNumber, formatNumberForInput } from "@/lib/utils";

const formSchema = z.object({
  type: z.string({
    message: "Type is required",
  }),
  name: z.string({
    message: "Item Name is required",
  }),
  unit: z.string({
    message: "Unit is required",
  }),
  description: z.string({
    message: "Description is required",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number",
  }),
});

const EditItemForm = ({ itemId }: { itemId: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      name: "",
      description: "",
      unit: "",
      price: 0,
    },
  });

  useEffect(() => {
    if (itemId) {
      const fetchData = async () => {
        try {
          const fetchedItem = await getItem(itemId);
          if (fetchedItem.error) {
            toast({
              description: fetchedItem.error,
            });
          } else {
            setItem(fetchedItem);
            form.reset(fetchedItem);
          }
        } catch (error) {
          console.error("Failed to fetch item", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [itemId, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await editItem(itemId, values);
      if (response.error) {
        toast({
          description: response.error,
        });
      } else {
        toast({
          description: "Item updated successfully!",
        });
        router.push("/items");
      }
    } catch (error) {
      toast({
        description: "Failed to update item",
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <Form {...form}>
      <form
        className="w-auto flex flex-col gap-5 pb-[150px]"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Type{" "}
                <HoverCard>
                  <HoverCardTrigger>
                    <CircleHelp className="w-5 h-5" />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    Select if this item is a physical good or a service.
                    Remember that you cannot change the type if this item is
                    included in a transaction.
                  </HoverCardContent>
                </HoverCard>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="md:w-[400px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a transaction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="goods">Goods</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Item Name
              </FormLabel>
              <FormControl>
                <Input className="md:w-[400px]" required {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light flex items-center gap-2">
                Unit{" "}
                <HoverCard>
                  <HoverCardTrigger>
                    <CircleHelp className="w-5 h-5" />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    The item will be measured in terms of this unit (e.g.: kg,
                    dozen)
                  </HoverCardContent>
                </HoverCard>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="md:w-[400px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="kgs">KGS - KILOGRAM</SelectItem>
                  <SelectItem value="gms">GMS - GRAMS</SelectItem>
                  <SelectItem value="box">BOX - BOX</SelectItem>
                  <SelectItem value="mtr">MTR - METERS</SelectItem>
                  <SelectItem value="unt">UNT - UNITS</SelectItem>
                  <SelectItem value="pcs">PCS - PIECES</SelectItem>
                  <SelectItem value="prs">PRS - PAIRS</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="md:flex md:items-center">
              <FormLabel className="md:w-60 md:text-lg font-light">
                Selling Price ( ₱ )
              </FormLabel>
              <FormControl>
                <Input
                  className="md:w-[400px]"
                  required
                  {...field}
                  value={displayValue}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^0-9]/g, "");
                    const numValue = parseInt(rawValue, 10);
                    setDisplayValue(formatNumberForInput(numValue));
                    field.onChange(numValue);
                  }}
                />
              </FormControl>
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

export default EditItemForm;

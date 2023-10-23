"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { useToast } from "~/app/_components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";

const formSchema = z.object({
  caseId: z.number(),
  amount: z.string().min(1, {
    message: "Amount is required",
  }),
  itemNumber: z.string(),
  description: z.string(),
  propertyOwner: z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    phone: z.string().min(1, {
      message: "Phone is required",
    }),
    email: z.string(),
  }),
  address: z.object({
    street: z.string().min(1, {
      message: "Street is required",
    }),
    unit: z.string(),
    city: z.string().min(1, {
      message: "City is required",
    }),
    state: z.string().min(1, {
      message: "State is required",
    }),
    zip: z.string().min(1, {
      message: "Zip is required",
    }),
  }),
});

export function AddDepositDialog({ caseId }: { caseId: number }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const addDepositMutation = api.deposit.create.useMutation({
    onSuccess: () => {
      form.reset();
      toast({
        title: "Deposit added",
        description: "Deposit has been added to the case.",
      });
      router.refresh();
      setOpen(false);
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseId: caseId,
      amount: "0",
      itemNumber: "",
      description: "",
      propertyOwner: {
        name: "",
        phone: "",
        email: "",
      },
      address: {
        street: "",
        unit: "",
        city: "",
        state: "",
        zip: "",
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addDepositMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Deposit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add deposit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid gap-4 py-2 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Amount" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="itemNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Case number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Item number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Description" />
                  </FormControl>
                  <FormDescription>
                    (optional) A description of the deposit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="propertyOwner.name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Property owner name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="propertyOwner.phone"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Property owner phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="propertyOwner.email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Property owner email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address.street"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Street" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address.unit"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Unit" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address.city"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="City" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address.state"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="State" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address.zip"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Zip" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="col-span-4 sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { useState } from "react";
import {
  type Deposit,
  type PropertyOwner,
  type Address,
  type Case,
} from "~/server/db/schema";
import { Button } from "~/app/_components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/app/_components/ui/dropdown-menu";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "~/app/_components/ui/select";
import PhoneInput from "~/app/_components/ui/phone-input";
import { useToast } from "~/app/_components/ui/use-toast";

import { Input } from "~/app/_components/ui/input";
import { useRouter } from "next/navigation";
import { type ZodSchema, z } from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";

interface PropertyOwnerExtended extends PropertyOwner {
  addresses?: Address[];
}

interface DepositExtended extends Deposit {
  propertyOwner: PropertyOwnerExtended | null;
  case: Case;
}

const formSchema = z.object({
  caseId: z.number(),
  propertyOwnerId: z.number().optional(),
  description: z.string(),
  distributeTo: z.enum(["property_owner", "forfeit"]),
  status: z.enum(["pending", "approved", "rejected"]),
  amount: z.string(),
  propertyOwner: z
    .object({
      name: z.string(),
      phone: z.string(),
      email: z.string().email().optional(),
    })
    .optional(),
  address: z
    .object({
      street: z.string(),
      unit: z.string().optional(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    })
    .optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function RecentDepositList({
  deposits,
}: {
  deposits: DepositExtended[];
}) {
  const [open, setOpen] = useState(false);
  const [deposit, setDeposit] = useState<DepositExtended | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const resolver: Resolver<FormSchemaType> = async (
    values,
    context,
    options,
  ) => {
    let schema: ZodSchema<FormSchemaType> = formSchema;
    if (values.distributeTo === "property_owner") {
      schema = z.object({
        caseId: z.number(),
        propertyOwnerId: z.number().optional(),
        description: z.string(),
        distributeTo: z.enum(["property_owner", "forfeit"]),
        status: z.enum(["pending", "approved", "rejected"]),
        amount: z.string(),
        propertyOwner: z.object({
          name: z.string(),
          phone: z.string(),
          email: z.string().email().optional(),
        }),
        address: z.object({
          street: z.string(),
          unit: z.string().optional(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
        }),
      });
    } else {
      schema = z.object({
        caseId: z.number(),
        propertyOwnerId: z.number().optional(),
        description: z.string(),
        distributeTo: z.enum(["property_owner", "forfeit"]),
        status: z.enum(["pending", "approved", "rejected"]),
        amount: z.string(),
      });
    }
    return zodResolver(schema)(values, context, options);
  };

  const createDistributionRequestMutation =
    api.disbursementRequest.create.useMutation({
      onSuccess: () => {
        toast({
          description: "Disbursement request created",
        });
        form.reset();
        router.refresh();
        setOpen(false);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
        });
        form.setError("amount", {
          message: error.message,
        });
      },
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: resolver,
    defaultValues: {
      caseId: deposit?.caseId,
      propertyOwnerId: deposit?.propertyOwner?.id,
      description: "",
      distributeTo: "property_owner",
      status: "pending",
      amount: deposit?.amount.toString() ?? "",
      propertyOwner: undefined,
      address: undefined,
    },
  });

  function updateFormValues(deposit: DepositExtended) {
    form.setValue("caseId", deposit.caseId);
    form.setValue("propertyOwnerId", deposit.propertyOwner?.id);
    form.setValue("amount", deposit.amount.toString());
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Trying to submit");
    if (Number(values.amount) > Number(deposit?.amount)) {
      form.setError("amount", {
        message: "Amount cannot be greater than deposit amount",
      });
    } else {
      createDistributionRequestMutation.mutate(values);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 items-center justify-start gap-2 text-sm font-medium">
        <div className="col-span-3">Case</div>
        <div className="col-span-1">Item #</div>
        <div className="col-span-2 justify-self-end">Value</div>
        <div className="col-span-1"></div>
      </div>

      {deposits.map((deposit) => (
        <div key={deposit.id} className="grid grid-cols-7 items-center gap-2">
          <div className="col-span-3 text-sm">{deposit.case.caseNumber}</div>
          <div className="col-span-1 text-sm">{deposit.itemNumber}</div>
          <div className="col-span-2 justify-self-end font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Number(deposit.amount))}
          </div>
          <div className="col-span-1 justify-self-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                  >
                    <DotsHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="">
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeposit(deposit);
                        updateFormValues(deposit);
                      }}
                    >
                      Request disbursement
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New disbursement request</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    className="grid gap-4 py-2"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <FormField
                      name="amount"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input placeholder="Amount" {...field} />
                          </FormControl>
                          <FormDescription>
                            Amount to be released for payment.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="description"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="distributeTo"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Disburse to</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="property_owner">
                                Property Owner
                              </SelectItem>
                              <SelectItem value="forfeit">Forfeit</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.getValues().distributeTo === "property_owner" && (
                      <>
                        <FormField
                          name="propertyOwner.name"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="col-span-1">
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
                            <FormItem className="col-span-1">
                              <FormLabel>Property owner phone</FormLabel>
                              <FormControl>
                                <PhoneInput {...field} placeholder="Phone" />
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
                      </>
                    )}

                    <DialogFooter className="col-span-2 sm:justify-between">
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
          </div>
        </div>
      ))}
    </div>
  );
}

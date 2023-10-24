"use client";
import { useState } from "react";
import {
  type Deposit,
  type PropertyOwner,
  type Address,
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
import { useToast } from "~/app/_components/ui/use-toast";

import { Input } from "~/app/_components/ui/input";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";

interface PropertyOwnerExtended extends PropertyOwner {
  addresses: Address[];
}

interface DepositExtended extends Deposit {
  propertyOwner: PropertyOwnerExtended;
}

const formSchema = z.object({
  caseId: z.number(),
  propertyOwnerId: z.number(),
  description: z.string(),
  distributeTo: z.enum(["property_owner", "forfeit"]),
  status: z.enum(["pending", "approved", "rejected"]),
  amount: z.string(),
});

export function DepositList({ deposits }: { deposits: DepositExtended[] }) {
  const [open, setOpen] = useState(false);
  const [deposit, setDeposit] = useState<DepositExtended | null>(null);
  const router = useRouter();
  const { toast } = useToast();

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
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseId: deposit?.caseId,
      propertyOwnerId: deposit?.propertyOwner.id,
      description: "",
      distributeTo: "property_owner",
      status: "pending",
      amount: deposit?.amount,
    },
  });

  function updateFormValues(deposit: DepositExtended) {
    form.setValue("caseId", deposit.caseId);
    form.setValue("propertyOwnerId", deposit.propertyOwner.id);
    form.setValue("amount", deposit.amount);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
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
      <div className="grid grid-cols-9 items-center justify-start gap-2 text-sm font-medium">
        <div className="col-span-2 space-y-1">Property Owner</div>
        <div className="col-span-1">Item #</div>
        <div className="col-span-3">Description</div>
        <div className="col-span-2 justify-self-end">Value</div>
        <div className="col-span-1"></div>
      </div>

      {deposits.map((deposit) => (
        <div key={deposit.id} className="grid grid-cols-9 items-center gap-2">
          <div className="col-span-2 space-y-1">
            <p className="text-sm font-medium leading-none">
              {deposit.propertyOwner.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {deposit.propertyOwner.email}
            </p>
          </div>
          <div className="col-span-1 text-sm">{deposit.itemNumber}</div>
          <div className="col-span-3 truncate text-sm">
            {deposit.description}
          </div>
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
                        <FormItem>
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
                        <FormItem>
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
                        <FormItem>
                          <FormLabel>Distribute to</FormLabel>
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

                    <DialogFooter className="sm:justify-between">
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

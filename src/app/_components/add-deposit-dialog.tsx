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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/app/_components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";
import { Calendar } from "~/app/_components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { useToast } from "~/app/_components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import PhoneInput from "~/app/_components/ui/phone-input";

const formSchema = z.object({
  caseId: z.string(),
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

export function AddDepositDialog({ caseId }: { caseId: number | null }) {
  const [open, setOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<"deposit" | "case">("deposit");
  const { toast } = useToast();
  const router = useRouter();
  const { data: cases } = api.case.getCaseNumbers.useQuery();
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
      caseId: caseId?.toString() ?? "",
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
    addDepositMutation.mutate({
      ...values,
      caseId: Number(values.caseId),
    });
  }

  function setCaseId(id: number) {
    form.setValue("caseId", id.toString());
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Deposit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add {currentForm === "deposit" ? "Deposit" : "Case"}
          </DialogTitle>
        </DialogHeader>
        {currentForm === "deposit" ? (
          <Form {...form}>
            <form
              className="grid gap-4 py-2 sm:grid-cols-2 lg:grid-cols-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {!caseId && cases ? (
                <FormField
                  name="caseId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>Case</FormLabel>
                      <div className="flex items-center space-x-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? cases.find((c) => c.value === field.value)
                                      ?.label
                                  : "Select case..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[354px] p-0">
                            <Command>
                              <CommandInput placeholder="Search case..." />
                              <CommandEmpty>No case found.</CommandEmpty>
                              <CommandGroup>
                                {cases.map((c) => (
                                  <CommandItem
                                    value={c.label}
                                    key={c.value}
                                    onSelect={() => {
                                      form.setValue("caseId", c.value);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        c.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {c.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <Button onClick={() => setCurrentForm("case")}>
                          Add new
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
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
                    <FormLabel>Item number</FormLabel>
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
                  <FormItem className="col-span-4">
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
                      <PhoneInput {...field} placeholder="Phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="propertyOwner.email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
        ) : (
          <AddCaseForm setCurrentForm={setCurrentForm} setCaseId={setCaseId} />
        )}
      </DialogContent>
    </Dialog>
  );
}

const caseFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  caseNumber: z.string().min(1, {
    message: "Case number is required",
  }),
  description: z.string(),
  caseDate: z.date(),
});

export function AddCaseForm({
  setCurrentForm,
  setCaseId,
}: {
  setCurrentForm: (form: "deposit" | "case") => void;
  setCaseId: (id: number) => void;
}) {
  const utils = api.useUtils();
  const form = useForm<z.infer<typeof caseFormSchema>>({
    resolver: zodResolver(caseFormSchema),
    defaultValues: {
      name: "",
      caseNumber: "",
      description: "",
      caseDate: new Date(),
    },
  });

  const addCaseMutation = api.case.create.useMutation({
    onSuccess: async (data) => {
      form.reset();
      await utils.case.getCaseNumbers.invalidate();
      setCaseId(data?.id ?? 0);
      setCurrentForm("deposit");
    },
  });

  function onSubmit(values: z.infer<typeof caseFormSchema>) {
    addCaseMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form className="grid gap-4 py-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="caseNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Case number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Case name" />
              </FormControl>
              <FormDescription>A short name for the case.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caseDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
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
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>When the case was filed.</FormDescription>
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
              <FormDescription>
                (optional) A description of the case.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setCurrentForm("deposit");
              }}
              variant="secondary"
            >
              Back
            </Button>
          </DialogClose>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

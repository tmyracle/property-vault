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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";
import { Calendar } from "~/app/_components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  caseNumber: z.string().min(1, {
    message: "Case number is required",
  }),
  description: z.string(),
  caseDate: z.date(),
});

export function AddCaseDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const addCaseMutation = api.case.create.useMutation({
    onSuccess: () => {
      form.reset();
      router.refresh();
      setOpen(false);
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      caseNumber: "",
      description: "",
      caseDate: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addCaseMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Case</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add case</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid gap-4 py-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
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

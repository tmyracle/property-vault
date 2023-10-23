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

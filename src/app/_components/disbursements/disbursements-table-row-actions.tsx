"use client";

//import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";

import { Button } from "~/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { type DisbursementRequest } from "~/server/db/schema";

import { disbursementRequestSchema } from "~/app/_components/disbursements/data/schema";

interface DisbursementsTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DisbursementsTableRowActions<
  TData extends DisbursementRequest,
>({ row }: DisbursementsTableRowActionsProps<TData>) {
  const caseRow = disbursementRequestSchema.parse(row.original);
  //const [menuOpen, setMenuOpen] = useState(false);

  return (
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
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => console.log(caseRow.id)}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

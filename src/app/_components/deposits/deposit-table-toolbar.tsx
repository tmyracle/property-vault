"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { DepositTableViewOptions } from "./deposit-table-view-options";

//import { priorities, statuses } from "./data/data";
//import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DepositTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter?: string;
  setGlobalFilter: (value: string) => void;
}

export function DepositTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
}: DepositTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter cases..."
          value={globalFilter ?? ""}
          onChange={(event) =>
            setGlobalFilter(String(event.currentTarget.value))
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DepositTableViewOptions table={table} />
    </div>
  );
}

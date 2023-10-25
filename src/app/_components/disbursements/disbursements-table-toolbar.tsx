"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { DisbursementsTableViewOptions } from "./disbursements-table-view-options";
import { DisbursementsTableFacetedFilter } from "./disbursements-table-faceted-filter";
import { statuses } from "./data/data";
import { api } from "~/trpc/react";
//import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DisbursementsTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter?: string;
  setGlobalFilter: (value: string) => void;
}

export function DisbursementsTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
}: DisbursementsTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const uniqueCases = api.disbursementRequest.getUniqueCaseNumbers.useQuery();

  const caseNumbers =
    uniqueCases.data?.map((caseNumber) => ({
      value: caseNumber,
      label: caseNumber,
    })) ?? [];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter disbursements..."
          value={globalFilter ?? ""}
          onChange={(event) =>
            setGlobalFilter(String(event.currentTarget.value))
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("Case Number") && (
          <DisbursementsTableFacetedFilter
            column={table.getColumn("Case Number")}
            title="Case"
            options={caseNumbers}
          />
        )}
        {table.getColumn("status") && (
          <DisbursementsTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
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
      <DisbursementsTableViewOptions table={table} />
    </div>
  );
}

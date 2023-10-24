"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type Case, type Deposit } from "~/server/db/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { type Row } from "@tanstack/react-table";

interface ExtendedCase extends Case {
  deposits: Deposit[];
}

const calculateDeposits = (row: Row<ExtendedCase>) => {
  return row.original.deposits.reduce((acc, deposit) => {
    return acc + Number(deposit.amount);
  }, 0);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns: ColumnDef<ExtendedCase, any>[] = [
  {
    accessorKey: "caseNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("caseNumber")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "caseDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="">
        {row.getValue("caseDate")
          ? new Date(row.getValue("caseDate")).toLocaleDateString()
          : ""}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "deposits",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deposits" />
    ),
    cell: ({ row }) => (
      <div>
        {" "}
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(calculateDeposits(row))}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="grow truncate font-medium">
            {row.getValue("description")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => (
      <div className="flex !justify-end">
        <DataTableRowActions row={row} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

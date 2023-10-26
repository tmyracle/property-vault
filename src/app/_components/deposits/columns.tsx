"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  type Case,
  type Deposit,
  type PropertyOwner,
  type Address,
} from "~/server/db/schema";
import { DepositTableColumnHeader } from "./deposit-table-column-header";
import { DepositTableRowActions } from "./deposit-table-row-actions";

export interface ExtendedDeposit extends Deposit {
  case: Case;
  propertyOwner: ExtendedPropertyOwner;
}

interface ExtendedPropertyOwner extends PropertyOwner {
  addresses: Address[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns: ColumnDef<ExtendedDeposit, any>[] = [
  {
    accessorKey: "Case Number",
    accessorFn: (row) => row.case.caseNumber,
    header: ({ column }) => (
      <DepositTableColumnHeader column={column} title="Case" />
    ),
    cell: ({ row }) => <div className="">{row.original.case.caseNumber}</div>,
    filterFn: (row, id, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return value.includes(row.original.case.caseNumber);
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "depositDate",
    accessorFn: (row) => row.createdAt?.toLocaleDateString(),
    header: ({ column }) => (
      <DepositTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="">
        {row.getValue("depositDate")
          ? new Date(row.getValue("depositDate")).toLocaleDateString()
          : ""}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "itemNumber",
    header: ({ column }) => (
      <DepositTableColumnHeader column={column} title="Item #" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("itemNumber")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "owner",
    accessorFn: (row) => row.propertyOwner.name,
    header: ({ column }) => (
      <DepositTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => (
      <div className="">{row.original.propertyOwner.name}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DepositTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <div>
        {" "}
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(row.getValue("amount"))}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DepositTableColumnHeader column={column} title="Description" />
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
    header: ({ column }) => (
      <DepositTableColumnHeader column={column} title="" />
    ),
    cell: ({ row }) => (
      <div className="flex !justify-end">
        <DepositTableRowActions row={row} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

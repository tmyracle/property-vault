"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  type Case,
  type Deposit,
  type DisbursementRequest,
} from "~/server/db/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { type Row } from "@tanstack/react-table";

interface ExtendedCase extends Case {
  deposits: Deposit[];
  disbursementRequests: DisbursementRequest[];
}

const calculateDeposits = (row: Row<ExtendedCase> | ExtendedCase) => {
  if ("original" in row) {
    return row.original.deposits.reduce((acc, deposit) => {
      return acc + Number(deposit.amount);
    }, 0);
  } else {
    return row.deposits.reduce((acc, deposit) => {
      return acc + Number(deposit.amount);
    }, 0);
  }
};

const calculateDisbursements = (row: Row<ExtendedCase> | ExtendedCase) => {
  if ("original" in row) {
    return row.original.disbursementRequests.reduce((acc, disbursement) => {
      if (disbursement.status === "approved") {
        return acc + Number(disbursement.amount);
      } else {
        return acc;
      }
    }, 0);
  } else {
    return row.disbursementRequests.reduce((acc, disbursement) => {
      if (disbursement.status === "approved") {
        return acc + Number(disbursement.amount);
      } else {
        return acc;
      }
    }, 0);
  }
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
    accessorFn: (row) => row.caseDate?.toLocaleDateString(),
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
    accessorFn: (row) => calculateDeposits(row),
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
    accessorKey: "disbursements",
    accessorFn: (row) => calculateDisbursements(row),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Disbursements" />
    ),
    cell: ({ row }) => (
      <div>
        {" "}
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(calculateDisbursements(row))}
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

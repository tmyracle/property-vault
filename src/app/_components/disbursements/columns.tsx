"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  type Case,
  type PropertyOwner,
  type DisbursementRequest,
} from "~/server/db/schema";
import { statuses } from "./data/data";
import { DisbursementsTableColumnHeader } from "./disbursements-table-column-header";
import { DisbursementsTableRowActions } from "./disbursements-table-row-actions";
import { StatusBadge } from "../disbursement-card";

interface ExtendedDisbursementRequest extends DisbursementRequest {
  case: Case;
  propertyOwner: PropertyOwner;
  requester: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns: ColumnDef<ExtendedDisbursementRequest, any>[] = [
  {
    accessorKey: "Case Number",
    accessorFn: (row) => row.case.caseNumber,
    header: ({ column }) => (
      <DisbursementsTableColumnHeader column={column} title="Case" />
    ),
    cell: ({ row }) => (
      <div className="">{row.original.case?.caseNumber ?? ""}</div>
    ),
    filterFn: (row, id, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return value.includes(row.original.case.caseNumber);
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    accessorFn: (row) => row.createdAt.toLocaleDateString(),
    header: ({ column }) => (
      <DisbursementsTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="">
        {row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : ""}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DisbursementsTableColumnHeader column={column} title="Amount" />
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
    accessorKey: "Disburse To",
    accessorFn: (row) =>
      row.distributeTo === "property_owner" ? "Owner" : "Forfeit",
    header: ({ column }) => (
      <DisbursementsTableColumnHeader column={column} title="Disburse To" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="grow truncate">
            {row.original.distributeTo === "property_owner"
              ? "Owner"
              : "Forfeit"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Requested By",
    header: ({ column }) => (
      <DisbursementsTableColumnHeader column={column} title="Requested By" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="grow truncate capitalize">
            {row.original.requester}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DisbursementsTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex space-x-2">
          <StatusBadge status={row.original.status} />
        </div>
      );
    },
    filterFn: (row, id, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: ({ column }) => (
      <DisbursementsTableColumnHeader column={column} title="" />
    ),
    cell: ({ row }) => (
      <div className="flex !justify-end">
        <DisbursementsTableRowActions row={row} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

"use client";
import { columns } from "~/app/_components/deposits/columns";

import {
  type Case,
  type PropertyOwner,
  type Address,
  type Deposit,
} from "~/server/db/schema";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { DepositTable } from "./deposit-table";

export interface ExtendedDeposit extends Deposit {
  case: Case;
  propertyOwner: ExtendedPropertyOwner | null;
}

interface ExtendedPropertyOwner extends PropertyOwner {
  addresses: Address[];
}

export function DepositsContainer({
  deposits,
}: {
  deposits: ExtendedDeposit[];
}) {
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent}>
      <DepositTable columns={columns} data={deposits} />
    </div>
  );
}

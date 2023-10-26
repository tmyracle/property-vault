"use client";
import { useState, useEffect } from "react";
import { columns } from "~/app/_components/deposits/columns";

import {
  type Case,
  type PropertyOwner,
  type Address,
  type Deposit,
} from "~/server/db/schema";
import { useAutoAnimate } from "@formkit/auto-animate/react";
//import { DisbursementCard } from "./disbursement-card";
import { useSearchParams } from "next/navigation";
import { DepositTable } from "./deposit-table";
import { DepositCard } from "./deposit-card";

export interface ExtendedDeposit extends Deposit {
  case: Case;
  propertyOwner: ExtendedPropertyOwner;
}

interface ExtendedPropertyOwner extends PropertyOwner {
  addresses: Address[];
}

export function DepositsContainer({
  deposits,
}: {
  deposits: ExtendedDeposit[];
}) {
  const [selectedDeposit, setSelectedDeposit] =
    useState<ExtendedDeposit | null>(null);
  const [parent] = useAutoAnimate();
  const searchParams = useSearchParams();

  useEffect(() => {
    const depositSlug = searchParams.get("id");
    if (depositSlug) {
      const selected = deposits.find((deposit) => deposit.slug === depositSlug);
      setSelectedDeposit(selected ?? null);
    }
  }, [deposits, searchParams]);

  return (
    <div ref={parent} className="grid grid-cols-8 gap-4">
      <div
        className={
          selectedDeposit ? "lg:col-span-4 xl:col-span-5" : "col-span-8"
        }
      >
        <DepositTable
          columns={columns}
          data={deposits}
          selectedDeposit={selectedDeposit}
        />
      </div>
      {selectedDeposit && (
        <div className="lg:col-span-4 xl:col-span-3">
          <DepositCard
            deposit={selectedDeposit}
            setSelectedDeposit={setSelectedDeposit}
          />
        </div>
      )}
    </div>
  );
}

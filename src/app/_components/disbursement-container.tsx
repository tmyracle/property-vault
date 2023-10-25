"use client";
import { useState } from "react";
import { DisbursementsTable } from "~/app/_components/disbursements/disbursements-table";
import { columns } from "~/app/_components/disbursements/columns";

import {
  type Case,
  type PropertyOwner,
  type Address,
  type DisbursementRequest,
} from "~/server/db/schema";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { DisbursementCard } from "./disbursement-card";

export interface ExtendedDisbursementRequest extends DisbursementRequest {
  case: Case;
  propertyOwner: ExtendedPropertyOwner;
  requester: string;
}

interface ExtendedPropertyOwner extends PropertyOwner {
  addresses: Address[];
}

export function DisbursementContainer({
  disbursementRequests,
}: {
  disbursementRequests: ExtendedDisbursementRequest[];
}) {
  const [selectedDisbursement, setSelectedDisbursementRequest] =
    useState<ExtendedDisbursementRequest | null>(null);
  const [parent] = useAutoAnimate();
  return (
    <div ref={parent} className="grid grid-cols-8 gap-4">
      <div
        className={
          selectedDisbursement ? "lg:col-span-4 xl:col-span-5" : "col-span-8"
        }
      >
        <DisbursementsTable
          columns={columns}
          data={disbursementRequests}
          setSelectedDisbursementRequest={setSelectedDisbursementRequest}
        />
      </div>
      {selectedDisbursement && (
        <div className="lg:col-span-4 xl:col-span-3">
          <DisbursementCard
            disbursement={selectedDisbursement}
            setSelectedDisbursementRequest={setSelectedDisbursementRequest}
          />
        </div>
      )}
    </div>
  );
}

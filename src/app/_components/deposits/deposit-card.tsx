"use client";
import { type ExtendedDeposit } from "./deposits-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Separator } from "~/app/_components/ui/separator";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";

interface DisbursementCardProps {
  deposit: ExtendedDeposit;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedDeposit: (value: any) => void;
}

export function DepositCard({
  deposit,
  setSelectedDeposit,
}: DisbursementCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function closeRequestCard() {
    const params = new URLSearchParams(searchParams);
    params.delete("id");
    router.push("/deposits");
    setSelectedDeposit(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-start justify-between">
            <div>Deposit Detail</div>
            <div
              onClick={() => closeRequestCard()}
              className="-mr-2 -mt-2 cursor-pointer rounded p-2 hover:bg-gray-100"
            >
              <Cross1Icon />
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          Created on {deposit.createdAt.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="text-sm">
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="text-sm font-medium text-gray-900">Case</div>
          <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {deposit.case.caseNumber}
          </div>
        </div>
        <Separator />
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="text-sm font-medium text-gray-900">Amount</div>
          <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Number(deposit.amount))}
          </div>
        </div>
        <Separator />
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="text-sm font-medium text-gray-900">Item #</div>
          <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <div>{deposit.itemNumber ?? "Not provided"}</div>
          </div>
        </div>
        <Separator />
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="text-sm font-medium text-gray-900">Description</div>
          <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {deposit.description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

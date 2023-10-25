"use client";
import {
  type DisbursementRequest,
  type PropertyOwner,
} from "~/server/db/schema";
import { Button } from "~/app/_components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/app/_components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface DisbursementRequestExtended extends DisbursementRequest {
  propertyOwner: PropertyOwner;
}

export function DisbursementList({
  disbursementRequests,
}: {
  disbursementRequests: DisbursementRequestExtended[];
}) {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-9 items-center justify-start gap-2 text-sm font-medium">
        <div className="col-span-4 space-y-1">Property Owner</div>

        <div className="col-span-2">Remit To</div>
        <div className="col-span-1 ">Status</div>
        <div className="col-span-1 justify-self-end">Amount</div>
        <div className="col-span-1"></div>
      </div>

      {disbursementRequests.map((disbursementRequest) => (
        <div
          key={disbursementRequest.id}
          className="grid grid-cols-9 items-center gap-2"
        >
          <div className="col-span-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {disbursementRequest.propertyOwner.name}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {disbursementRequest.description}
            </p>
          </div>

          <div className="col-span-2 text-sm">
            {disbursementRequest.distributeTo === "property_owner"
              ? "Owner"
              : "Forfeit"}
          </div>
          <div className="col-span-1 text-sm">
            {disbursementRequest.status.charAt(0).toUpperCase() +
              disbursementRequest.status.slice(1)}
          </div>
          <div className="col-span-1 justify-self-end text-sm">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Number(disbursementRequest.amount))}
          </div>
          <div className="col-span-1 justify-self-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                  onSelect={() =>
                    router.push(`/disbursements?id=${disbursementRequest.slug}`)
                  }
                >
                  Approval Detail
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}

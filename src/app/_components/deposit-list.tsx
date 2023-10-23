import {
  type Deposit,
  type PropertyOwner,
  type Address,
} from "~/server/db/schema";
import { Button } from "~/app/_components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/app/_components/ui/dropdown-menu";

interface PropertyOwnerExtended extends PropertyOwner {
  addresses: Address[];
}

interface DepositExtended extends Deposit {
  propertyOwner: PropertyOwnerExtended;
}

export function DepositList({ deposits }: { deposits: DepositExtended[] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-9 items-center justify-start gap-2 text-sm font-medium">
        <div className="col-span-2 space-y-1">Property Owner</div>
        <div className="col-span-1">Item #</div>
        <div className="col-span-3">Description</div>
        <div className="col-span-2 justify-self-end">Value</div>
        <div className="col-span-1"></div>
      </div>

      {deposits.map((deposit) => (
        <div key={deposit.id} className="grid grid-cols-9 items-center gap-2">
          <div className="col-span-2 space-y-1">
            <p className="text-sm font-medium leading-none">
              {deposit.propertyOwner.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {deposit.propertyOwner.email}
            </p>
          </div>
          <div className="col-span-1 text-sm">{deposit.itemNumber}</div>
          <div className="col-span-3 truncate text-sm">
            {deposit.description}
          </div>
          <div className="col-span-2 justify-self-end font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Number(deposit.amount))}
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
                <DropdownMenuItem>Request disbursement</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}

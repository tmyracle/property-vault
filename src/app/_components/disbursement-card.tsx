"use client";
import { type ExtendedDisbursementRequest } from "./disbursement-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { useUser } from "@clerk/nextjs";
import { Button } from "~/app/_components/ui/button";
import { Badge } from "~/app/_components/ui/badge";
import { Separator } from "~/app/_components/ui/separator";
import { Cross1Icon } from "@radix-ui/react-icons";
import { api } from "~/trpc/react";
import { useToast } from "~/app/_components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { parsePhoneNumberFromString } from "libphonenumber-js";

interface DisbursementCardProps {
  disbursement: ExtendedDisbursementRequest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedDisbursementRequest: (value: any) => void;
}

export function DisbursementCard({
  disbursement,
  setSelectedDisbursementRequest,
}: DisbursementCardProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateRequest = api.disbursementRequest.updateRequest.useMutation({
    onSuccess: (data) => {
      toast({
        description: "Disbursement request updated",
      });
      router.refresh();
      setSelectedDisbursementRequest(data);
    },
  });

  function voteOnRequest(status: "pending" | "approved" | "rejected") {
    updateRequest.mutate({
      id: disbursement.id,
      status,
    });
  }

  function closeRequestCard() {
    const params = new URLSearchParams(searchParams);
    params.delete("id");
    router.push("/disbursements");
    setSelectedDisbursementRequest(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-start justify-between">
            <div>
              Disbursement request for case {disbursement.case.caseNumber}
            </div>
            <div
              onClick={() => closeRequestCard()}
              className="-mr-2 -mt-2 cursor-pointer rounded p-2 hover:bg-gray-100"
            >
              <Cross1Icon />
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          Requested by {disbursement.requester} on{" "}
          {disbursement.createdAt.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="text-sm">
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="text-sm font-medium text-gray-900">Amount</div>
          <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Number(disbursement.amount))}
          </div>
        </div>
        <Separator />
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="text-sm font-medium text-gray-900">Status</div>
          <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <StatusBadge status={disbursement.status} />
          </div>
        </div>
        <Separator />
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="text-sm font-medium text-gray-900">Description</div>
          <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {disbursement.description}
          </div>
        </div>

        <Separator />
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="text-sm font-medium text-gray-900">Disburse to</div>
          <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {disbursement.distributeTo === "property_owner" ? (
              <div>
                <div className="text-sm">{disbursement.propertyOwner.name}</div>
                <div className="text-sm text-muted-foreground">
                  {disbursement.propertyOwner.email}
                </div>
                <div className="text-sm text-muted-foreground">
                  {parsePhoneNumberFromString(
                    disbursement.propertyOwner.phone ?? "",
                    "US",
                  )?.formatNational()}
                </div>
                {disbursement.propertyOwner.addresses?.length > 0 ? (
                  <div className="text-sm">
                    <div>{disbursement.propertyOwner.addresses[0]?.street}</div>
                    <div>{disbursement.propertyOwner.addresses[0]?.unit}</div>
                    <div>
                      {disbursement.propertyOwner.addresses[0]?.city},{" "}
                      {disbursement.propertyOwner.addresses[0]?.state}{" "}
                      {disbursement.propertyOwner.addresses[0]?.zip}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              "Forfeit to agency"
            )}
          </div>
        </div>
      </CardContent>
      {user &&
      user.publicMetadata.role === "admin" &&
      disbursement.status === "pending" ? (
        <>
          <Separator className="mb-6" />
          <CardFooter>
            <div className="flew-col flex w-full items-center justify-between space-x-4">
              <Button
                className="grow"
                variant="positive"
                onClick={() => voteOnRequest("approved")}
              >
                Approve
              </Button>
              <Button
                className="grow"
                variant="destructive"
                onClick={() => voteOnRequest("rejected")}
              >
                Reject
              </Button>
            </div>
          </CardFooter>
        </>
      ) : null}
    </Card>
  );
}

export function StatusBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected";
}) {
  function getBadgeStyle(status: string) {
    switch (status) {
      case "pending":
        return "secondary";

      case "approved":
        return "positive";

      case "rejected":
        return "destructive";

      default:
        return "secondary";
    }
  }

  return (
    <Badge variant={getBadgeStyle(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

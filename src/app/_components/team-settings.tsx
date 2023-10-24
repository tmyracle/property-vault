"use client";
//import {Button} from "~/app/_components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "~/app/_components/ui/select";
import { useToast } from "~/app/_components/ui/use-toast";

export function TeamSettings() {
  const { organization } = useOrganization();
  const [orgId, setOrgId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user: currentUser, isLoaded } = useUser();

  const getUsers = api.user.getUsers.useQuery(orgId ?? "", {
    enabled: !!orgId,
  });

  const updateUserRole = api.user.updateUserRole.useMutation({
    onSuccess: async () => {
      toast({
        description: "User role updated",
      });
      await getUsers.refetch();
    },
  });

  useEffect(() => {
    if (organization?.id) {
      setOrgId(organization.id);
    }
  }, [organization]);

  if (!getUsers || !isLoaded || !currentUser) {
    return null;
  }

  function handleSelectChange(userId: string, value: string) {
    updateUserRole.mutate({
      userId,
      role: value,
    });
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getUsers.data?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.imageUrl} alt="User" />
                    <AvatarFallback>
                      {user.emailAddresses[0]?.emailAddress[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-muted-foreground">
                      {user.emailAddresses[0]?.emailAddress}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  disabled={currentUser.publicMetadata.role !== "admin"}
                  defaultValue={(user.publicMetadata.role as string) ?? ""}
                  onValueChange={(value: string) =>
                    handleSelectChange(user.id, value)
                  }
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select permissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {user.lastSignInAt
                  ? new Date(user.lastSignInAt).toLocaleDateString()
                  : "Never"}
              </TableCell>
              <TableCell>{user.banned ? "Disabled" : "Active"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

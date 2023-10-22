"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { api } from "~/trpc/react";

export function CreateCase() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [caseNumber, setCaseNumber] = useState("");

  const createCase = api.case.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setDescription("");
      setCaseNumber("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createCase.mutate({ name, description, caseNumber });
      }}
      className="flex flex-col gap-2"
    >
      <Label htmlFor="name">Case name</Label>
      <Input
        type="text"
        id="name"
        placeholder="Case name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Label htmlFor="caseNumber">Case number</Label>
      <Input
        type="text"
        id="caseNumber"
        placeholder="Case number"
        value={caseNumber}
        onChange={(e) => setCaseNumber(e.target.value)}
      />
      <Label htmlFor="description">Description</Label>
      <Input
        type="text"
        id="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button type="submit" disabled={createCase.isLoading}>
        {createCase.isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}

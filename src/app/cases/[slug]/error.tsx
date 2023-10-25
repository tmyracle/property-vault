"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/app/_components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
  }, [error, reset, router]);

  return (
    <div className="mx-auto flex max-w-xs flex-col justify-center space-y-4 pt-36">
      <h2 className="text-center text-lg font-medium">Something went wrong!</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => router.push("/cases")
        }
      >
        Return to safety
      </Button>
    </div>
  );
}

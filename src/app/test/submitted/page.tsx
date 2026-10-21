"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TestSubmittedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="p-8 max-w-md text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Test Submitted Successfully!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for completing the aptitude test. Your responses have been submitted
          and are now being reviewed by our HR team.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          You will be notified via email about the next steps in the recruitment process.
        </p>
        <Button onClick={() => router.push("/")} className="w-full">
          Return to Homepage
        </Button>
      </Card>
    </div>
  );
}

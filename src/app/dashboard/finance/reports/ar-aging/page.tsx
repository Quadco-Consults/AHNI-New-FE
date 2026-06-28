"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";

export default function ARAgingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to financial reports with AR aging filter
    router.push("/dashboard/finance/financial-reports?report=ar-aging");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
      <p className="ml-4">Loading Accounts Receivable Aging Report...</p>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";

export default function CashFlowPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to financial reports with cash flow filter
    router.push("/dashboard/finance/financial-reports?report=cash-flow");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
      <p className="ml-4">Loading Cash Flow Statement...</p>
    </div>
  );
}

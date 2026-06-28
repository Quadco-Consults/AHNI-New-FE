"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";

export default function IncomeStatementPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to financial reports with income statement filter
    router.push("/dashboard/finance/financial-reports?report=income-statement");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
      <p className="ml-4">Loading Income Statement Report...</p>
    </div>
  );
}

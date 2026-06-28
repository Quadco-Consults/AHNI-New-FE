"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";

export default function BalanceSheetPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to financial reports with balance sheet filter
    router.push("/dashboard/finance/financial-reports?report=balance-sheet");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
      <p className="ml-4">Loading Balance Sheet Report...</p>
    </div>
  );
}

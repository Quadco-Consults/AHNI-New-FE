"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";

export default function GeneralLedgerPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to financial reports with general ledger filter
    router.push("/dashboard/finance/financial-reports?report=general-ledger");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
      <p className="ml-4">Loading General Ledger Report...</p>
    </div>
  );
}

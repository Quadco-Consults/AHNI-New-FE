"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";

export default function BudgetVariancePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to financial reports with budget variance filter
    router.push("/dashboard/finance/financial-reports?report=budget-variance");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
      <p className="ml-4">Loading Grant Budget vs Actuals Report...</p>
    </div>
  );
}

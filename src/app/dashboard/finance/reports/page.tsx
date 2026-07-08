"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FinancialReportsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main financial reports dashboard
    router.replace("/dashboard/finance/financial-reports");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to Financial Reports...</p>
    </div>
  );
}

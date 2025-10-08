"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";

export default function VendorManagementPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to prequalification page as the default vendor management view
    router.replace("/dashboard/procurement/vendor-management/prequalification");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
}

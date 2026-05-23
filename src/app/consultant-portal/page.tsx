"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";

export default function ConsultantPortalPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.replace("/consultant-portal/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

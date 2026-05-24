"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";
import { ConsultantAuthUtils } from "@/features/consultant-portal/controllers/consultantAuthController";

export default function ConsultantPortalPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if consultant is authenticated
    if (ConsultantAuthUtils.isConsultantAuthenticated()) {
      // Redirect authenticated consultants to dashboard
      router.replace("/consultant-portal/dashboard");
    } else {
      // Redirect unauthenticated users to login page
      router.replace("/consultant-portal/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

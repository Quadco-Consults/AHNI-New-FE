"use client";

import dynamic from "next/dynamic";

const PerformanceManagementForm = dynamic(() => import("@/features/hr/components/performance-management/form/index"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function PerformanceManagementCreatePage() {
  return <PerformanceManagementForm />;
}
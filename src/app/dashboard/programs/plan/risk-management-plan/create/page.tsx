"use client";

import dynamic from "next/dynamic";

const RiskManagementCreate = dynamic(() => import("@/features/programs/components/plan/risk-management/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function RiskManagementCreatePage() {
  return <RiskManagementCreate />;
}
"use client";

import dynamic from "next/dynamic";

const ProcurementPlanIndex = dynamic(() => import("@/features/procurement/components/procurement-plan/index"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function ProcurementPlanPage() {
  return <ProcurementPlanIndex />;
}
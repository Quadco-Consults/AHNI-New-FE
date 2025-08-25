"use client";

import dynamic from "next/dynamic";

const CompensationSpread = dynamic(() => import("@/features/hr/components/employee-benefits/CompensationSpread"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function CompensationSpreadPage() {
    return <CompensationSpread />;
}
"use client";

import dynamic from "next/dynamic";

const Compensation = dynamic(() => import("@/features/hr/components/employee-benefits/Compensation"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function CompensationPage() {
    return <Compensation />;
}
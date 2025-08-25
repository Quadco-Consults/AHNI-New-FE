"use client";

import dynamic from "next/dynamic";

const Payroll = dynamic(() => import("@/features/hr/components/employee-benefits/Payroll/index"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function PayrollPage() {
    return <Payroll />;
}
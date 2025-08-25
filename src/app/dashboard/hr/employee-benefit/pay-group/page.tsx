"use client";

import dynamic from "next/dynamic";

const PayGroup = dynamic(() => import("@/features/hr/components/employee-benefits/PayGroup"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function PayGroupPage() {
    return <PayGroup />;
}
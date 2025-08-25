"use client";

import dynamic from "next/dynamic";

const NewCompensation = dynamic(() => import("@/features/hr/components/employee-benefits/NewCompensation"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function NewCompensationPage() {
    return <NewCompensation />;
}
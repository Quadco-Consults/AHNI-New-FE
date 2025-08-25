"use client";

import dynamic from "next/dynamic";

const PurchaseRequestForm = dynamic(() => import("@/features/procurement/components/purchase-request/create-purchase-request/form"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function PurchaseRequestFormPage() {
  return <PurchaseRequestForm />;
}
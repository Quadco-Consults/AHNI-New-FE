"use client";

import dynamic from "next/dynamic";

const PendingPurchaseRequests = dynamic(() => import("@/features/procurement/components/purchase-request"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function PendingPurchaseRequestsPage() {
  return <PendingPurchaseRequests />;
}
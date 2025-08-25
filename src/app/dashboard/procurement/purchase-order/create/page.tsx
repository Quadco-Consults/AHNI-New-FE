"use client";

import dynamic from "next/dynamic";

const CreatePurchaseOrder = dynamic(() => import("@/features/procurement/components/purchase-order/PurchaseOrderNew"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function CreatePurchaseOrderPage() {
  return <CreatePurchaseOrder />;
}
"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreatePurchaseOrder = dynamic(
  () =>
    import("@/features/procurement/components/purchase-order/PurchaseOrderNew"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreatePurchaseOrderPage() {
  return <CreatePurchaseOrder />;
}

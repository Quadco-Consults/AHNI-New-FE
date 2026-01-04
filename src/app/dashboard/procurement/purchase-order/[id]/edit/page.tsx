"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const EditPurchaseOrder = dynamic(
  () =>
    import("@/features/procurement/components/purchase-order/EditPurchaseOrder"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function EditPurchaseOrderPage() {
  return <EditPurchaseOrder />;
}
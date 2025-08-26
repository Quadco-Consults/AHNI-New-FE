"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const PendingPurchaseRequests = dynamic(
  () => import("@/features/procurement/components/purchase-request"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function PendingPurchaseRequestsPage() {
  return <PendingPurchaseRequests />;
}

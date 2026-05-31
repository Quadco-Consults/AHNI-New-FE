"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const BulkPaymentComponent = dynamic(
  () => import("@/features/admin/components/payment-request/bulk-payment"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function BulkPaymentPage() {
  return <BulkPaymentComponent />;
}

"use client";

import dynamic from "next/dynamic";

const PaymentRequestCreate = dynamic(() => import("@/features/admin/components/payment-request/create/index"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function PaymentRequestCreatePage() {
  return <PaymentRequestCreate />;
}
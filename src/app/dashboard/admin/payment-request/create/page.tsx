"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const PaymentRequestCreate = dynamic(
  () => import("@/features/admin/components/payment-request/create/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function PaymentRequestCreatePage() {
  return <PaymentRequestCreate />;
}

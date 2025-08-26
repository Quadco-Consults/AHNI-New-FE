"use client";

import dynamic from "next/dynamic";
import { Loading } from "@/components/Loading";

const PurchaseRequestForm = dynamic(
  () =>
    import(
      "@/features/procurement/components/purchase-request/create-purchase-request/form"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function PurchaseRequestFormPage() {
  return <PurchaseRequestForm />;
}

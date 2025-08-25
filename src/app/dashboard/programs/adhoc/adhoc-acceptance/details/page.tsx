"use client";

import dynamic from "next/dynamic";

const ConsultantAcceptanceDetails = dynamic(() => import("@/features/contracts-grants/components/contract-management/consultant-acceptance/id"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function AdhocAcceptanceDetailsPage() {
  return <ConsultantAcceptanceDetails />;
}
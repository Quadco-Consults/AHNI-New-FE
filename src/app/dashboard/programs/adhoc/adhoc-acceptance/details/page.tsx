"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const ConsultantAcceptanceDetails = dynamic(
  () =>
    import(
      "@/features/contracts-grants/components/contract-management/consultant-acceptance/id"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AdhocAcceptanceDetailsPage() {
  return <ConsultantAcceptanceDetails />;
}

"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AgreementSummary = dynamic(
  () =>
    import(
      "@/features/contracts-grants/components/contract-management/agreement/summary"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateAgreementDetailsPage() {
  return <AgreementSummary />;
}

"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const ApplicantAcceptanceForm = dynamic(
  () =>
    import(
      "@/features/contracts-grants/components/contract-management/consultant-acceptance/id"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function ApplicantAcceptanceFormPage() {
  return <ApplicantAcceptanceForm />;
}
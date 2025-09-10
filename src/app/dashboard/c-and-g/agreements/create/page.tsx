"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AgreementCreate = dynamic(
  () =>
    import(
      "@/features/contracts-grants/components/contract-management/agreement/create"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateAgreementPage() {
  return <AgreementCreate />;
}
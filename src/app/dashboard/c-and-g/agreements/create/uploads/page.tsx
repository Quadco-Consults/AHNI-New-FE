"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AgreementUploads = dynamic(
  () =>
    import(
      "@/features/contracts-grants/components/contract-management/agreement/uploads"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateAgreementUploadsPage() {
  return <AgreementUploads />;
}

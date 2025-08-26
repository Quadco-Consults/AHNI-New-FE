"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const ConsultancyReportCreate = dynamic(
  () =>
    import(
      "@/features/contracts-grants/components/contract-management/consultancy-report/create"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function ConsultancyReportCreatePage() {
  return <ConsultancyReportCreate />;
}

"use client";

import dynamic from "next/dynamic";

const ConsultancyReportCreate = dynamic(() => import("@/features/contracts-grants/components/contract-management/consultancy-report/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function CreateConsultancyReportPage() {
    return <ConsultancyReportCreate />;
}
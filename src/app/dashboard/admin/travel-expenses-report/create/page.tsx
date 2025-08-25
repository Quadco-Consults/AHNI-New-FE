"use client";

import dynamic from "next/dynamic";

const TravelExpensesReportCreate = dynamic(() => import("@/features/admin/components/travel-expenses-report/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function TravelExpensesReportCreatePage() {
  return <TravelExpensesReportCreate />;
}
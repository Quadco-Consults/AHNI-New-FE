"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const TravelExpensesReportCreate = dynamic(
  () => import("@/features/admin/components/travel-expenses-report/create"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function TravelExpensesReportCreatePage() {
  return <TravelExpensesReportCreate />;
}

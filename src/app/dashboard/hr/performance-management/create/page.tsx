"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const PerformanceManagementForm = dynamic(
  () => import("@/features/hr/components/performance-management/form/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function PerformanceManagementCreatePage() {
  return <PerformanceManagementForm />;
}

"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const LeaveIntegrationTest = dynamic(
  () => import("@/features/hr/components/leave-management/LeaveIntegrationTest"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function LeaveTestPage() {
  return <LeaveIntegrationTest />;
}
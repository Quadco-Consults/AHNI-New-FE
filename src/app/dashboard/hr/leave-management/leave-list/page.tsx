"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const LeaveApprovalDashboard = dynamic(
  () => import("@/features/hr/components/leave-management/LeaveApprovalDashboard"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function LeaveListPage() {
  return <LeaveApprovalDashboard />;
}
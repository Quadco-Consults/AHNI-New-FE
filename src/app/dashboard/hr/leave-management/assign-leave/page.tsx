"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const AssignLeaveDashboard = dynamic(
  () => import("@/features/hr/components/leave-management/AssignLeaveDashboard"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function AssignLeavePage() {
  return <AssignLeaveDashboard />;
}
